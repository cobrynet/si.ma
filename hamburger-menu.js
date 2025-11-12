// ========== GESTIONE MENU HAMBURGER MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger Menu: Script inizializzato');
    
    // Crea il pulsante hamburger se non esiste
    const header = document.querySelector('.header');
    const menu = document.querySelector('.menu');
    
    console.log('Header trovato:', header);
    console.log('Menu trovato:', menu);
    console.log('Larghezza finestra:', window.innerWidth);
    
    if (header && menu && window.innerWidth <= 820) {
        // Verifica se l'hamburger esiste già
        let hamburger = document.querySelector('.hamburger');
        
        if (!hamburger) {
            console.log('Creazione pulsante hamburger...');
            // Crea il pulsante hamburger
            hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.setAttribute('aria-label', 'Menu');
            hamburger.setAttribute('type', 'button');
            hamburger.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            
            // Inserisci l'hamburger nell'header
            header.appendChild(hamburger);
            console.log('✓ Pulsante hamburger creato e inserito');
        } else {
            console.log('Pulsante hamburger già esistente');
        }
        
        // Toggle menu al click dell'hamburger + overlay blocco interazione
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = hamburger.classList.toggle('active');
            menu.classList.toggle('active');

            let overlay = document.querySelector('.menu-overlay');
            if (isActive) {
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'menu-overlay';
                    document.body.appendChild(overlay);
                }
                overlay.classList.add('visible');
                document.body.classList.add('menu-open');
            } else {
                if (overlay) {
                    overlay.classList.remove('visible');
                }
                document.body.classList.remove('menu-open');
            }
            
            console.log('Menu toggled:', isActive ? 'aperto' : 'chiuso');
        });
        
        // Chiudi menu al click su una voce
        const menuItems = menu.querySelectorAll('a');
        console.log('Voci menu trovate:', menuItems.length);
        
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                console.log('Click su voce menu');
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const overlay = document.querySelector('.menu-overlay');
                if (overlay) overlay.classList.remove('visible');
            });
        });
        
        // Chiudi menu al click fuori dal menu
        document.addEventListener('click', function(e) {
            if (menu.classList.contains('active') && 
                !menu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                console.log('Click fuori dal menu - chiusura');
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const overlay = document.querySelector('.menu-overlay');
                if (overlay) overlay.classList.remove('visible');
            }
        });
        
        console.log('✓ Event listeners aggiunti');
    } else {
        console.log('Condizioni non soddisfatte per hamburger menu');
    }
    
    // Gestione ridimensionamento
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const hamburger = document.querySelector('.hamburger');
            const menu = document.querySelector('.menu');
            
            if (window.innerWidth > 820 && hamburger) {
                console.log('Passaggio a desktop - rimozione hamburger');
                hamburger.remove();
                if (menu) {
                    menu.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
                const overlay = document.querySelector('.menu-overlay');
                if (overlay) overlay.remove();
            }
        }, 250);
    });
});
