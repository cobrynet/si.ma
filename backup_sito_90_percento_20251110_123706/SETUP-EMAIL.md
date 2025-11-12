# 📧 Configurazione Email per Vercel + Resend

## 🚀 Setup Rapido (3 passi)

### 1. Ottieni la chiave API Resend
1. Vai su [resend.com](https://resend.com) e registrati/accedi
2. Vai in **API Keys** → **Create API Key**
3. Copia la chiave che inizia con `re_...`

### 2. Aggiungi la chiave su Vercel
1. Vai su [vercel.com](https://vercel.com) e apri il tuo progetto
2. Settings → **Environment Variables**
3. Aggiungi una nuova variabile:
   - **Key:** `RESEND_API_KEY`
   - **Value:** (la chiave copiata da Resend)
   - **Environment:** Production, Preview, Development (spunta tutte)
4. Clicca **Save**

### 3. Deploy su Vercel
```bash
# Se non hai ancora installato Vercel CLI
npm i -g vercel

# Deploy del sito
vercel --prod
```

Oppure connetti il repo GitHub su Vercel → push automatico!

---

## 🧪 Test locale (opzionale)

Per testare in locale prima del deploy:

```bash
# 1. Installa dipendenze
npm install

# 2. Crea file .env dalla copia di esempio
cp .env.example .env

# 3. Modifica .env e inserisci la tua chiave Resend
# RESEND_API_KEY=re_tuachiavevera

# 4. Avvia Vercel Dev Server
vercel dev
```

Il sito sarà su `http://localhost:3000`

---

## 📝 Come funziona

### Endpoint API
- URL: `https://tuosito.vercel.app/api/send-email`
- Metodo: `POST`
- Body JSON:
```json
{
  "department": "info@assistenzalavanderie.it",
  "fullname": "Mario Rossi",
  "email": "mario@esempio.it",
  "phone": "055 1234567",
  "organization": "Azienda XYZ",
  "message": "Richiesta informazioni..."
}
```

### Form HTML (esempio)
```html
<form id="contactForm">
  <input name="fullname" required placeholder="Nome e Cognome">
  <input name="email" type="email" required placeholder="Email">
  <input name="phone" placeholder="Telefono">
  <textarea name="message" required placeholder="Messaggio"></textarea>
  <button type="submit">Invia</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      department: 'info@assistenzalavanderie.it',
      fullname: formData.get('fullname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      organization: formData.get('organization') || '',
      message: formData.get('message')
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert('Email inviata con successo!');
    e.target.reset();
  } else {
    alert('Errore: ' + data.message);
  }
});
</script>
```

---

## 🔒 Sicurezza

✅ **La chiave API NON è mai esposta nel codice frontend**
- Sta solo nelle variabili ambiente Vercel
- Le funzioni API girano lato server
- Il frontend chiama solo `/api/send-email` (senza chiavi)

✅ **Validazione input**
- Email validata con regex
- Input sanitizzati contro XSS
- Rate limiting di Vercel attivo

---

## 🎯 Verifica dominio Resend (opzionale ma consigliato)

Per inviare email da `info@assistenzalavanderie.it` invece di `onboarding@resend.dev`:

1. Su Resend: Domains → **Add Domain**
2. Inserisci `assistenzalavanderie.it`
3. Aggiungi i record DNS che Resend ti fornisce
4. Attendi verifica (5-10 minuti)
5. Modifica `api/send-email.js`:
   ```javascript
   from: 'Si.ma SRL <info@assistenzalavanderie.it>'
   ```

---

## 📊 Limiti Resend

### Piano Gratuito
- 3.000 email/mese
- 100 email/giorno
- Perfetto per un sito aziendale

### Se serve di più
- Piano Pro: $20/mese → 50.000 email
- [Prezzi completi](https://resend.com/pricing)

---

## ❓ Problemi comuni

### "RESEND_API_KEY non definita"
→ Aggiungi la variabile ambiente su Vercel e rideploya

### Email finisce in spam
→ Verifica il dominio su Resend + aggiungi SPF/DKIM

### Errore 500 in produzione
→ Controlla i log: Vercel Dashboard → Functions → Logs

---

## 📞 Supporto

Se hai problemi:
- Docs Vercel: [vercel.com/docs](https://vercel.com/docs)
- Docs Resend: [resend.com/docs](https://resend.com/docs)
- Log Vercel: Dashboard → il tuo progetto → Functions
