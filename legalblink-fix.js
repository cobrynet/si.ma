// Fix per centrare il modal LegalBlink su mobile
(function() {
    'use strict';
    
    let modalOpen = false;
    
    // Funzione per forzare il posizionamento centrato
    function fixModalPosition() {
        // Cerca tutti i possibili elementi del modal LegalBlink
        const selectors = [
            '[class*="lb-cs"]',
            '[id*="lb-cs"]',
            '[class*="lb_cs"]',
            '[id*="lb_cs"]',
            '[class*="legalblink"]',
            '[class*="cookie"]',
            'div[style*="position"]'
        ];
        
        let foundModal = false;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const computed = window.getComputedStyle(el);
                
                // Se l'elemento è grande (probabile modal) E visibile
                if (rect.height > 100 && rect.width > 100 && computed.display !== 'none' && computed.visibility !== 'hidden') {
                    foundModal = true;
                    el.style.position = 'fixed';
                    el.style.top = '50%';
                    el.style.left = '50%';
                    el.style.transform = 'translate(-50%, -50%)';
                    el.style.zIndex = '999999';
                    el.style.maxHeight = '80vh';
                    el.style.maxWidth = '90vw';
                    el.style.overflow = 'auto';
                    el.style.bottom = 'auto';
                    el.style.margin = '0';
                }
            });
        });
        
        // Blocca lo scroll SOLO se il modal è stato trovato e visibile
        if (foundModal && !modalOpen) {
            modalOpen = true;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else if (!foundModal && modalOpen) {
            // Sblocca lo scroll se il modal non c'è più
            modalOpen = false;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
    
    // Osserva i cambiamenti nel DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                fixModalPosition();
            }
        });
    });
    
    // Avvia l'osservatore
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Fix immediato al caricamento
    window.addEventListener('DOMContentLoaded', fixModalPosition);
    window.addEventListener('load', fixModalPosition);
    
    // Fix periodico per sicurezza
    setInterval(fixModalPosition, 500);
    
    // Fix al click sui link delle preferenze cookie
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('lb-cs-settings-link') ||
            e.target.classList.contains('footer-mobile-link')) {
            setTimeout(fixModalPosition, 100);
            setTimeout(fixModalPosition, 300);
            setTimeout(fixModalPosition, 500);
        }
    });
})();
