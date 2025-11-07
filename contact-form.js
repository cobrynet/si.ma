/* Script per gestire il form di contatto con invio email tramite API Vercel */

// Gestisce l'invio del form contatti
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form?.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Invia';
    
    if (!form) {
        console.warn('Form contatti non trovato nella pagina');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disabilita il pulsante durante l'invio
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Invio in corso...';
            submitButton.style.opacity = '0.6';
        }
        
        try {
            // Raccoglie i dati dal form
            const formData = new FormData(form);
            const data = {
                department: formData.get('department') || 'info@assistenzalavanderie.it',
                fullname: formData.get('fullname')?.trim(),
                email: formData.get('email')?.trim(),
                phone: formData.get('phone')?.trim() || '',
                organization: formData.get('organization')?.trim() || '',
                message: formData.get('message')?.trim()
            };
            
            // Validazione base lato client
            if (!data.fullname || !data.email || !data.message) {
                throw new Error('Compila tutti i campi obbligatori');
            }
            
            // Validazione email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Inserisci un indirizzo email valido');
            }
            
            // Invia la richiesta all'API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Successo - mostra messaggio e resetta il form
                showMessage('success', result.message || 'Email inviata con successo! Ti risponderemo al più presto.');
                form.reset();
                
                // Chiudi eventuale modale dopo 2 secondi
                setTimeout(() => {
                    const modal = document.querySelector('.contact-modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                }, 2000);
            } else {
                // Errore - mostra il messaggio di errore
                throw new Error(result.message || 'Errore durante l\'invio');
            }
            
        } catch (error) {
            console.error('Errore invio form:', error);
            showMessage('error', error.message || 'Errore durante l\'invio. Riprova più tardi.');
        } finally {
            // Riabilita il pulsante
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                submitButton.style.opacity = '1';
            }
        }
    });
}

// Mostra messaggi di feedback all'utente
function showMessage(type, text) {
    // Rimuovi eventuali messaggi precedenti
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crea il messaggio
    const message = document.createElement('div');
    message.className = `form-message form-message-${type}`;
    message.textContent = text;
    
    // Stile del messaggio
    Object.assign(message.style, {
        padding: '15px 20px',
        marginTop: '20px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '500',
        textAlign: 'center',
        animation: 'slideDown 0.3s ease',
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
    });
    
    // Inserisci il messaggio dopo il form
    const form = document.getElementById('contact-form');
    if (form) {
        form.parentNode.insertBefore(message, form.nextSibling);
        
        // Rimuovi il messaggio dopo 5 secondi
        setTimeout(() => {
            message.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
}

// Aggiungi CSS per le animazioni
function addMessageStyles() {
    if (!document.getElementById('form-message-styles')) {
        const style = document.createElement('style');
        style.id = 'form-message-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addMessageStyles();
        initContactForm();
    });
} else {
    addMessageStyles();
    initContactForm();
}

// Esporta per uso in altri script se necessario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initContactForm, showMessage };
}
