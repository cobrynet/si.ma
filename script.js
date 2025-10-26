// Gestione del carosello
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carosello: Script inizializzato');
    
    const carouselContainer = document.querySelector('.carosello-foto1');
    const leftArrow = document.querySelector('.freccia-sinistra');
    const rightArrow = document.querySelector('.freccia-destra');
    const carouselDots = document.querySelectorAll('.pallino-1, .pallino-2, .pallino-3, .pallino-4');
    
    console.log('Carosello trovato:', carouselContainer);
    console.log('Freccia sinistra:', leftArrow);
    console.log('Freccia destra:', rightArrow);
    console.log('Pallini trovati:', carouselDots.length);
    
    if (!carouselContainer) {
        console.error('Carosello non trovato!');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = 4;
    
    // Array delle immagini del carosello
    const carouselImages = [
        'contenuti/foto/foto-slide-test.jpg',
        'contenuti/foto/foto-slide-test-2.JPG',
        'contenuti/foto/foto-slide-test-3.jpg',
        'contenuti/foto/foto-slide-test-4.jpg'
    ];

    // Funzione per aggiornare lo stato del carosello
    function updateCarousel(slideIndex) {
        console.log('Aggiornamento a slide:', slideIndex);
        
        // Aggiorna l'immagine di background del carosello
        carouselContainer.style.backgroundImage = `url('${carouselImages[slideIndex]}')`;
        carouselContainer.style.backgroundSize = 'cover';
        carouselContainer.style.backgroundPosition = 'center';
        
        // Aggiorna i pallini
        carouselDots.forEach((dot, index) => {
            dot.style.backgroundColor = index === slideIndex ? '#333' : '#bbb';
        });
        
        currentSlide = slideIndex;
    }

    // Gestione freccia sinistra
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            console.log('Click freccia sinistra');
            const newSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            updateCarousel(newSlide);
            resetAutoPlay();
        });
    }

    // Gestione freccia destra
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            console.log('Click freccia destra');
            const newSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel(newSlide);
            resetAutoPlay();
        });
    }

    // Gestione click sui pallini
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log('Click pallino:', index);
            updateCarousel(index);
            resetAutoPlay();
        });
    });

    // Auto-play del carosello ogni 3 secondi
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const nextSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel(nextSlide);
        }, 3000); // 3 secondi
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Inizializza il carosello
    updateCarousel(0);
    startAutoPlay();
    
    console.log('Carosello completamente inizializzato');

    // Gestione smooth scroll per i link del menu
    const menuLinks = document.querySelectorAll('.header a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Gestione click sul CTA button
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Aggiungi qui la logica per il call-to-action
            console.log('CTA button clicked');
            
            // Esempio: scroll alla sezione contatti
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Lazy loading per le immagini di background (simulazione)
    function simulateImageLoading() {
        const placeholders = document.querySelectorAll('[class*="rettangolo"], .foto-header, .carosello-foto1, .foto2');
        
        placeholders.forEach((placeholder, index) => {
            setTimeout(() => {
                placeholder.style.opacity = '0.8';
                placeholder.style.transition = 'opacity 0.3s ease';
                
                // Simula il caricamento di un'immagine
                setTimeout(() => {
                    placeholder.style.opacity = '1';
                }, 300);
            }, index * 100);
        });
    }

    // Avvia la simulazione del caricamento delle immagini
    simulateImageLoading();

    // Gestione hover effects per elementi interattivi
    const interactiveElements = document.querySelectorAll('.pulsante-cta, .ellipse, .social-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Parallax effect leggero per alcuni elementi (opzionale)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.foto-header, .carosello-foto1');
        
        parallaxElements.forEach(element => {
            const speed = 0.1;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Gestione tastiera per accessibilità
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('ellipse')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
        
        // Navigazione con frecce per il carosello
        if (e.key === 'ArrowLeft') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('ellipse')) {
                leftArrow.click();
            }
        } else if (e.key === 'ArrowRight') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('ellipse')) {
                rightArrow.click();
            }
        }
    });

    // Aggiungi attributi ARIA per l'accessibilità
    carouselDots.forEach((dot, index) => {
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Vai alla slide ${index + 1}`);
        dot.setAttribute('tabindex', '0');
    });

    if (leftArrow) leftArrow.setAttribute('aria-label', 'Slide precedente');
    if (rightArrow) rightArrow.setAttribute('aria-label', 'Slide successiva');

    // Inizializza il primo dot come attivo (pallino-3 è quello attivo di default)
    updateCarousel(2);

    // Effetto sequenziale SEMPLIFICATO per massima affidabilità
    const sezioneLavatrici = document.getElementById('sezione-lavatrici');
    
    if (sezioneLavatrici) {
        console.log('✅ Sezione TROVATA! Sistema semplificato...');
        
        let sequenceStarted = false;
        let checkInterval;
        
        // Funzione per controllare se la sezione è visibile
        function checkVisibility() {
            const rect = sezioneLavatrici.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Se la sezione è visibile (almeno 20% nel viewport)
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const percentVisible = (visibleHeight / rect.height) * 100;
            
            console.log(`�️ Visibilità: ${Math.round(percentVisible)}%`);
            
            if (percentVisible > 20 && !sequenceStarted) {
                console.log('🎬 ATTIVAZIONE SEQUENZA!');
                sequenceStarted = true;
                clearInterval(checkInterval);
                
                // Step 1: Dopo 1 secondo → cornice
                setTimeout(() => {
                    console.log('⚫ CORNICE!');
                    sezioneLavatrici.classList.add('veil-appear');
                    
                    // Step 2: Dopo altri 2 secondi → testo bianco
                    setTimeout(() => {
                        console.log('✨ TESTO BIANCO!');
                        sezioneLavatrici.classList.add('text-white');
                        console.log('🎭 SEQUENZA COMPLETATA!');
                    }, 2000);
                }, 1000);
            }
        }
        
        // Controlla ogni 500ms invece di usare IntersectionObserver
        checkInterval = setInterval(checkVisibility, 500);
        
        // Test manuale
        window.forceSequence = () => {
            if (!sequenceStarted) {
                console.log('🎮 FORZATURA SEQUENZA!');
                sequenceStarted = true;
                clearInterval(checkInterval);
                
                setTimeout(() => {
                    sezioneLavatrici.classList.add('veil-appear');
                    setTimeout(() => {
                        sezioneLavatrici.classList.add('text-white');
                    }, 2000);
                }, 1000);
            }
        };
        
        window.resetSequence = () => {
            sequenceStarted = false;
            sezioneLavatrici.classList.remove('veil-appear', 'text-white');
            checkInterval = setInterval(checkVisibility, 500);
            console.log('🔄 RESET - Ricontrolla scroll');
        };
        
    } else {
        console.log('❌ Sezione NON TROVATA!');
    }
});

// Gestione del ridimensionamento della finestra
window.addEventListener('resize', function() {
    // Aggiorna eventuali calcoli di posizionamento se necessario
    console.log('Window resized');
});

// Utility per debug (rimuovi in produzione)
function debugInfo() {
    console.log('Sito SI-MA SRL caricato correttamente');
    console.log('Sviluppato da Cobrynet Digital');
    console.log('Dimensioni corpo:', document.body.offsetWidth, 'x', document.body.offsetHeight);
}