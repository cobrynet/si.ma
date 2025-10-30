// Vercel Serverless Function per invio email
// Invia email all'azienda e conferma al cliente per richieste prodotto

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
            'amministrazione@assistenzialavanderie.it': 'amministrazione@assistenzialavanderie.it',
            'commerciale@assistenzialavanderie.it': 'commerciale@assistenzialavanderie.it',
            'manutenzione@assistenzialavanderie.it': 'manutenzione@assistenzialavanderie.it'
        };
        
        const toEmail = departmentEmails[department] || 'info@assistenzialavanderie.it';
        
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
        body { font-family: 'Outfit', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #e6ebf1; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #18202d; padding: 40px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; }
        .content { padding: 40px 30px; background-color: #ffffff; }
        .title { color: #18202d; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
        .field { margin-bottom: 20px; padding: 15px; background-color: #f5f8fb; border-left: 4px solid #82ADE1; }
        .label { font-weight: 600; color: #18202d; display: block; margin-bottom: 5px; }
        .value { color: #333; }
        .message-box { background-color: #f5f8fb; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .footer { background-color: #18202d; color: #82ADE1; padding: 30px 20px; text-align: center; font-size: 14px; }
        .footer a { color: #82ADE1; text-decoration: none; }
        .footer-info { margin: 10px 0; }
        .divider { height: 2px; background: linear-gradient(90deg, #82ADE1 0%, #18202d 100%); margin: 30px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="Si.ma SRL" class="logo">
        </div>
        <div class="content">
            <h2 class="title">${isProductRequest ? '🛒 Nuova Richiesta Prodotto' : '📧 Nuova Richiesta Contatto'}</h2>
            <div class="divider"></div>
            ${isProductRequest ? `
            <div class="field">
                <span class="label">🏷️ Prodotto Richiesto:</span>
                <span class="value">${productName}</span>
            </div>` : ''}
            <div class="field">
                <span class="label">👤 Nome Completo:</span>
                <span class="value">${cleanFullname}</span>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <span class="value"><a href="mailto:${cleanEmail}" style="color: #82ADE1;">${cleanEmail}</a></span>
            </div>
            <div class="field">
                <span class="label">📱 Telefono:</span>
                <span class="value">${cleanPhone}</span>
            </div>
            ${!isProductRequest && cleanOrganization !== 'Non specificata' ? `
            <div class="field">
                <span class="label">🏢 Organizzazione:</span>
                <span class="value">${cleanOrganization}</span>
            </div>` : ''}
            <div class="message-box">
                <span class="label">💬 Messaggio:</span>
                <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${cleanMessage}</div>
            </div>
        </div>
        <div class="footer">
            <p class="footer-info"><strong>Si.ma SRL</strong></p>
            <p class="footer-info">Via Stefano Ussi 22 - Scandicci (FI) 50018</p>
            <p class="footer-info">Tel. <a href="tel:0557327456">055 7327456</a></p>
            <p class="footer-info">Email: <a href="mailto:info@assistenzalavanderie.it">info@assistenzalavanderie.it</a></p>
            <p class="footer-info"><a href="${siteUrl}" target="_blank">www.assistenzalavanderie.it</a></p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">Email automatica dal form contatti del sito</p>
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
        body { font-family: 'Outfit', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #e6ebf1; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #18202d; padding: 40px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; }
        .content { padding: 40px 30px; background-color: #ffffff; text-align: center; }
        .title { color: #18202d; font-size: 26px; font-weight: 600; margin-bottom: 20px; }
        .message { color: #333; font-size: 16px; line-height: 1.8; margin: 20px 0; }
        .product-box { background-color: #f5f8fb; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid #82ADE1; }
        .product-name { color: #18202d; font-size: 20px; font-weight: 600; }
        .cta-box { background: linear-gradient(135deg, #18202d 0%, #2a3644 100%); padding: 30px; border-radius: 8px; margin: 30px 0; color: white; }
        .cta-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
        .contact-info { color: #82ADE1; font-size: 16px; margin: 10px 0; }
        .footer { background-color: #18202d; color: #82ADE1; padding: 30px 20px; text-align: center; font-size: 14px; }
        .footer a { color: #82ADE1; text-decoration: none; }
        .footer-links { margin-top: 20px; }
        .footer-links a { display: inline-block; margin: 0 10px; }
        .divider { height: 2px; background: linear-gradient(90deg, #82ADE1 0%, #18202d 100%); margin: 30px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="Si.ma SRL" class="logo">
        </div>
        <div class="content">
            <h1 class="title">✅ Grazie per averci contattato!</h1>
            <div class="divider"></div>
            <p class="message">
                Gentile <strong>${cleanFullname}</strong>,<br><br>
                Abbiamo ricevuto la tua richiesta di informazioni per:
            </p>
            <div class="product-box">
                <div class="product-name">${productName}</div>
            </div>
            <p class="message">
                Il nostro team commerciale la contatterà al più presto all'indirizzo email <strong>${cleanEmail}</strong> 
                o al numero <strong>${cleanPhone}</strong> per fornirle tutte le informazioni richieste.
            </p>
            <div class="cta-box">
                <div class="cta-title">📞 Hai bisogno di assistenza immediata?</div>
                <div class="contact-info">Tel. <a href="tel:0557327456" style="color: #82ADE1; text-decoration: none;">055 7327456</a></div>
                <div class="contact-info">Lun-Ven: 9:00 - 18:00</div>
                <div class="contact-info" style="margin-top: 15px;">Emergenze H24/7</div>
            </div>
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #666;">
                Nel frattempo, puoi visitare il nostro sito per scoprire altri prodotti e servizi.
            </p>
        </div>
        <div class="footer">
            <p><strong>Si.ma SRL</strong></p>
            <p>Via Stefano Ussi 22 - Scandicci (FI) 50018</p>
            <p>Tel. <a href="tel:0557327456">055 7327456</a></p>
            <p>Email: <a href="mailto:commerciale@assistenzialavanderie.it">commerciale@assistenzialavanderie.it</a></p>
            <p><a href="${siteUrl}" target="_blank">www.assistenzalavanderie.it</a></p>
            <div class="footer-links">
                <a href="${siteUrl}" target="_blank">Home</a> | 
                <a href="${siteUrl}/servizi.html" target="_blank">Servizi</a> | 
                <a href="${siteUrl}/sezione4.html" target="_blank">Nuovo/Usato</a> | 
                <a href="${siteUrl}/contatti.html" target="_blank">Contatti</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">P.IVA 01867350975</p>
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
        const { Resend } = require('resend');
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
                from: 'Si.ma SRL <commerciale@assistenzialavanderie.it>',
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
