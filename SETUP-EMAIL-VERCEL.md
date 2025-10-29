# Si.ma SRL - Configurazione Email per Vercel con Resend

## Setup Email su Vercel

Il form contatti è configurato per usare **Resend** per l'invio email.

### Configurazione Resend (Consigliato)

1. **Crea account Resend**: https://resend.com/
2. **Verifica dominio**: 
   - Vai su Dashboard → Domains
   - Aggiungi `assistenzalavanderie.it`
   - Configura i record DNS (SPF, DKIM)
3. **Ottieni API Key**: 
   - Dashboard → API Keys → Create API Key
4. **Configura su Vercel**:
   - Vai su Vercel Dashboard → tuo progetto → Settings → Environment Variables
   - Aggiungi: `RESEND_API_KEY` = `la_tua_api_key`
   - Aggiungi: `SITE_URL` = `https://tuodominio.com` (opzionale)

### Installazione Dipendenze

```bash
npm install
```

Questo installerà automaticamente `resend` come dipendenza.

## File Creati

- ✅ `/api/send-email.js` - Serverless Function per Vercel
- ✅ `vercel.json` - Configurazione deploy Vercel
- ✅ `contatti.html` - Aggiornato per usare `/api/send-email`
- ✅ `send-email.php` - Backup per hosting PHP tradizionale

## Deploy su Vercel

```bash
# Installa Vercel CLI (se non già installato)
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

## Test Locale (con Vercel CLI)

```bash
vercel dev
```

Questo avvierà un server locale che simula Vercel, così puoi testare le Serverless Functions.

## DNS Setup

Dopo il deploy su Vercel:
1. Vercel Dashboard → tuo progetto → Settings → Domains
2. Aggiungi il tuo dominio
3. Configura i DNS come indicato da Vercel

## Note Importanti

- Le email vengono inviate ai 3 dipartimenti: amministrazione, commerciale, supporto @assistenzialavanderie.it
- Il form include validazione lato client e server
- CORS è già configurato
- Il Reply-To è impostato sull'email dell'utente per rispondere facilmente
