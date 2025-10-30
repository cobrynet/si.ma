// Vercel Serverless Function per invio email
// Invia email all'azienda e conferma al cliente per richieste prodotto

import { Resend } from 'resend';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Metodo non consentito. Usa POST.'
        });
    }
    
    try {
        const { department, fullname, email, phone, organization, message } = req.body;
        
        // Validazione campi obbligatori
        if (!department || !fullname || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Compila tutti i campi obbligatori.'
            });
        }
        
        // Validazione formato email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Inserisci un indirizzo email valido.'
            });
        }
        
        // Sanitizzazione input
        const sanitize = (str) => String(str).replace(/[<>]/g, '');
        const cleanFullname = sanitize(fullname);
        const cleanEmail = email.toLowerCase().trim();
        const cleanPhone = sanitize(phone || 'Non fornito');
        const cleanOrganization = sanitize(organization || 'Non specificata');
        const cleanMessage = sanitize(message);
        
        // Determina destinatario
        const departmentEmails = {
            'amministrazione@assistenzalavanderie.it': 'amministrazione@assistenzalavanderie.it',
            'commerciale@assistenzalavanderie.it': 'commerciale@assistenzalavanderie.it',
            'manutenzione@assistenzalavanderie.it': 'manutenzione@assistenzalavanderie.it'
        };
        
        const toEmail = departmentEmails[department] || 'info@assistenzalavanderie.it';
        
        // Verifica se è una richiesta prodotto
        const isProductRequest = organization && organization.includes('€');
        const productName = isProductRequest ? organization : cleanOrganization;
        
        // URL base del sito
        const siteUrl = process.env.SITE_URL || 'https://www.assistenzalavanderie.it';
        const logoUrl = `${siteUrl}/contenuti/loghi/SIMA-LOGO_BIANCO.png`;
        
        // Template email per l'azienda
        const companyEmailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Outfit', Arial, sans-serif; line-height: 1.5; margin: 0; padding: 20px; background-color: #E8F1F8; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #E8F1F8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(24,32,45,0.1); }
        .header { background-color: #18202d; padding: 30px 20px; text-align: center; }
        .logo { max-width: 160px; height: auto; }
        .content { padding: 25px 30px; background-color: #E8F1F8; }
        .title { color: #18202d; font-size: 22px; font-weight: 700; margin: 0 0 20px 0; text-align: center; }
        .field { margin-bottom: 12px; padding: 12px 15px; background-color: rgba(255,255,255,0.7); border-radius: 6px; border-left: 3px solid #82ADE1; }
        .label { font-weight: 600; color: #18202d; font-size: 13px; display: block; margin-bottom: 4px; }
        .value { color: #5A7A95; font-size: 15px; }
        .message-box { background-color: rgba(255,255,255,0.7); padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #82ADE1; }
        .footer { background-color: #18202d; color: #82ADE1; padding: 20px; text-align: center; font-size: 13px; line-height: 1.6; }
        .footer a { color: #82ADE1; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="Si.ma SRL" class="logo">
        </div>
        <div class="content">
            <h2 class="title">${isProductRequest ? '🛒 Nuova Richiesta Prodotto' : '📧 Nuovo Contatto'}</h2>
            ${isProductRequest ? `
            <div class="field">
                <span class="label">🏷️ PRODOTTO</span>
                <span class="value"><strong>${productName}</strong></span>
            </div>` : ''}
            <div class="field">
                <span class="label">👤 NOME</span>
                <span class="value">${cleanFullname}</span>
            </div>
            <div class="field">
                <span class="label">📧 EMAIL</span>
                <span class="value"><a href="mailto:${cleanEmail}" style="color: #5A7A95; font-weight: 600;">${cleanEmail}</a></span>
            </div>
            <div class="field">
                <span class="label">📱 TELEFONO</span>
                <span class="value">${cleanPhone}</span>
            </div>
            ${!isProductRequest && cleanOrganization !== 'Non specificata' ? `
            <div class="field">
                <span class="label">🏢 AZIENDA</span>
                <span class="value">${cleanOrganization}</span>
            </div>` : ''}
            <div class="message-box">
                <span class="label">💬 MESSAGGIO</span>
                <div class="value" style="margin-top: 8px; white-space: pre-wrap;">${cleanMessage}</div>
            </div>
        </div>
        <div class="footer">
            <strong>Si.ma SRL</strong><br>
            Via Stefano Ussi 22 - Scandicci (FI) 50018<br>
            Tel. <a href="tel:0557327456">055 7327456</a> | <a href="mailto:info@assistenzalavanderie.it">info@assistenzalavanderie.it</a><br>
            <a href="${siteUrl}" target="_blank">www.assistenzalavanderie.it</a>
        </div>
    </div>
</body>
</html>`;
        
        // Template conferma cliente (solo per richieste prodotto)
        const customerEmailBody = isProductRequest ? `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Outfit', Arial, sans-serif; line-height: 1.5; margin: 0; padding: 20px; background-color: #E8F1F8; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #E8F1F8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(24,32,45,0.1); }
        .header { background-color: #18202d; padding: 30px 20px; text-align: center; }
        .logo { max-width: 160px; height: auto; }
        .content { padding: 25px 30px; background-color: #E8F1F8; text-align: center; }
        .title { color: #18202d; font-size: 24px; font-weight: 700; margin: 0 0 15px 0; }
        .message { color: #5A7A95; font-size: 15px; line-height: 1.7; margin: 15px 0; }
        .product-box { background-color: rgba(255,255,255,0.8); padding: 18px; border-radius: 8px; margin: 20px 0; border: 2px solid #82ADE1; }
        .product-name { color: #18202d; font-size: 18px; font-weight: 700; }
        .cta-box { background: linear-gradient(135deg, #18202d 0%, #2a3644 100%); padding: 25px; border-radius: 10px; margin: 20px 0; color: white; }
        .cta-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #82ADE1; }
        .contact-info { color: #82ADE1; font-size: 15px; margin: 8px 0; }
        .footer { background-color: #18202d; color: #82ADE1; padding: 20px; text-align: center; font-size: 13px; line-height: 1.6; }
        .footer a { color: #82ADE1; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="Si.ma SRL" class="logo">
        </div>
        <div class="content">
            <h1 class="title">✅ Grazie per averci contattato!</h1>
            <p class="message">
                Gentile <strong style="color: #18202d;">${cleanFullname}</strong>,<br>
                Abbiamo ricevuto la tua richiesta per:
            </p>
            <div class="product-box">
                <div class="product-name">${productName}</div>
            </div>
            <p class="message">
                Il nostro team commerciale ti contatterà al più presto a <strong style="color: #18202d;">${cleanEmail}</strong> 
                o al <strong style="color: #18202d;">${cleanPhone}</strong>.
            </p>
            <div class="cta-box">
                <div class="cta-title">📞 Hai bisogno di assistenza immediata?</div>
                <div class="contact-info">Tel. <a href="tel:0557327456" style="color: #82ADE1; text-decoration: none; font-weight: 600;">055 7327456</a></div>
                <div class="contact-info">Lun-Ven: 9:00 - 18:00 | Emergenze H24/7</div>
            </div>
        </div>
        <div class="footer">
            <strong>Si.ma SRL</strong><br>
            Via Stefano Ussi 22 - Scandicci (FI) 50018<br>
            Tel. <a href="tel:0557327456">055 7327456</a> | <a href="mailto:commerciale@assistenzalavanderie.it">commerciale@assistenzalavanderie.it</a><br>
            <a href="${siteUrl}" target="_blank">www.assistenzalavanderie.it</a><br>
            <span style="font-size: 11px; opacity: 0.8; margin-top: 10px; display: block;">P.IVA 01867350975</span>
        </div>
    </div>
</body>
</html>` : null;
        
        // Servizio email con Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            // Log per test locale (senza API key)
            console.log('Email azienda:', {
                to: toEmail,
                from: cleanEmail,
                subject: isProductRequest ? `Richiesta prodotto: ${productName}` : `Nuova richiesta da ${cleanFullname}`
            });
            
            if (customerEmailBody) {
                console.log('Email conferma cliente:', {
                    to: cleanEmail,
                    subject: `Grazie per averci contattato - ${productName}`
                });
            }
            
            return res.status(200).json({
                success: true,
                message: isProductRequest 
                    ? 'Richiesta ricevuta! Riceverai una conferma via email.' 
                    : 'Richiesta ricevuta con successo!'
            });
        }
        
        // IMPLEMENTAZIONE RESEND
        const resend = new Resend(resendApiKey);
        
        // Email all'azienda
        await resend.emails.send({
            from: 'Si.ma SRL <noreply@assistenzalavanderie.it>',
            to: toEmail,
            replyTo: cleanEmail,
            subject: isProductRequest ? `Richiesta prodotto: ${productName}` : `Nuova richiesta da ${cleanFullname}`,
            html: companyEmailBody
        });
        
        // Email conferma al cliente (solo per richieste prodotto)
        if (customerEmailBody) {
            await resend.emails.send({
                from: 'Si.ma SRL <commerciale@assistenzalavanderie.it>',
                to: cleanEmail,
                subject: `Grazie per averci contattato - ${productName}`,
                html: customerEmailBody
            });
        }
        
        return res.status(200).json({
            success: true,
            message: isProductRequest 
                ? 'Richiesta inviata! Riceverai una conferma via email.' 
                : `Email inviata con successo!`
        });
        
    } catch (error) {
        console.error('Errore invio email:', error);
        return res.status(500).json({
            success: false,
            message: 'Errore nell\'invio. Riprova più tardi.'
        });
    }
}

