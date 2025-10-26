// Gestione del carosello
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carosello: Script inizializzato');
    
    const carouselContainer = document.querySelector('.carosello-foto1');
    const carouselImageOld = document.querySelector('.carosello-image-old');
    const carouselImageNew = document.querySelector('.carosello-image-new');
    const leftArrow = document.querySelector('.freccia-sinistra');
    const rightArrow = document.querySelector('.freccia-destra');
    const carouselDots = document.querySelectorAll('.pallino-1, .pallino-2, .pallino-3, .pallino-4');
    
    console.log('Carosello trovato:', carouselContainer);
    console.log('Immagine old:', carouselImageOld);
    console.log('Immagine new:', carouselImageNew);
    console.log('Freccia sinistra:', leftArrow);
    console.log('Freccia destra:', rightArrow);
    console.log('Pallini trovati:', carouselDots.length);
    
    if (!carouselContainer || !carouselImageOld || !carouselImageNew) {
        console.error('Carosello o immagini non trovati!');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = 4;
    
    // Array delle immagini del carosello
    const carouselImages = [
        'contenuti/foto/foto-slide-si.ma-(1).jpeg',
        'contenuti/foto/foto-slide-si.ma-(2).jpeg',
        'contenuti/foto/foto-slide-si.ma-(3).jpeg',
        'contenuti/foto/foto-slide-si.ma-(4) .JPG'
    ];

    // Funzione per aggiornare lo stato del carosello con animazione
    function updateCarousel(slideIndex, direction = 'next') {
        console.log('Aggiornamento a slide:', slideIndex, 'Direzione:', direction);
        
        // Rimuovi tutte le classi di animazione
        carouselImageOld.className = 'carosello-image-old';
        carouselImageNew.className = 'carosello-image-new';
        
        // Copia l'immagine corrente nella vecchia
        const currentBg = carouselImageNew.style.backgroundImage;
        carouselImageOld.style.backgroundImage = currentBg;
        
        // Imposta la nuova immagine
        carouselImageNew.style.backgroundImage = `url('${carouselImages[slideIndex]}')`;
        
        // Forza reflow
        void carouselImageOld.offsetWidth;
        void carouselImageNew.offsetWidth;
        
        // Aggiungi animazioni in base alla direzione
        if (direction === 'next') {
            // Freccia destra: nuova entra da destra, vecchia esce a sinistra
            carouselImageNew.classList.add('slide-in-from-right');
            carouselImageOld.classList.add('slide-out-to-left');
        } else {
            // Freccia sinistra: nuova entra da sinistra, vecchia esce a destra
            carouselImageNew.classList.add('slide-in-from-left');
            carouselImageOld.classList.add('slide-out-to-right');
        }
        
        // Aggiorna i pallini
        carouselDots.forEach((dot, index) => {
            dot.style.backgroundColor = index === slideIndex ? '#333' : '#bbb';
        });
        
        currentSlide = slideIndex;
    }

    // Gestione freccia sinistra (vai a sinistra = slide da sinistra)
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            console.log('Click freccia sinistra');
            const newSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            updateCarousel(newSlide, 'prev');
            resetAutoPlay();
        });
    }

    // Gestione freccia destra (vai a destra = slide da destra)
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            console.log('Click freccia destra');
            const newSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel(newSlide, 'next');
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
});

// Effetto scroll per il titolo hero
console.log('Script hero caricato');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Cerco hero-line-2');
    const heroLine2 = document.querySelector('.hero-line-2');
    const heroCta = document.querySelector('.hero-cta');
    const heroCtaTextOnly = document.querySelector('.hero-cta-text-only');
    
    console.log('hero-line-2 trovato:', heroLine2);
    console.log('hero-cta trovato:', heroCta);
    console.log('hero-cta-text-only trovato:', heroCtaTextOnly);
    
    if (!heroLine2 || !heroCta || !heroCtaTextOnly) {
        console.error('ERRORE: hero-line-2, hero-cta o hero-cta-text-only non trovato!');
        return;
    }

    function checkScroll() {
        const scrollPosition = window.scrollY;
        console.log('Scroll position:', scrollPosition);
        
        // "lavatrici industriali" sempre visibile, inizia ingrandimento a 50px
        const trigger2 = 50;
        // L'ingrandimento continua fino a 600px di scroll
        const maxScroll = 600;
        
        // I CTA rimangono fissi, non si muovono durante lo scroll
        
        // Gestione "lavatrici industriali" - sempre visibile, si ingrandisce con scroll
        if (scrollPosition >= trigger2) {
            // Calcola l'ingrandimento progressivo da 110px a 140px
            const minFontSize = 110;
            const maxFontSize = 140;
            
            let scrollProgress2 = (scrollPosition - trigger2) / (maxScroll - trigger2);
            scrollProgress2 = Math.max(0, Math.min(1, scrollProgress2));
            
            const currentFontSize2 = minFontSize + (scrollProgress2 * (maxFontSize - minFontSize));
            heroLine2.style.fontSize = `${currentFontSize2}px`;
            
            console.log('Font size lavatrici industriali:', currentFontSize2);
        } else {
            // Testo sempre visibile, torna a dimensione normale
            heroLine2.style.fontSize = '110px';
        }
    }
    
    // Verifica all'avvio
    checkScroll();
    
    // Verifica durante lo scroll
    window.addEventListener('scroll', function() {
        checkScroll();
    });
    
    console.log('Effetto scroll hero inizializzato con successo');
});

// Animazione furgone sezione 1
document.addEventListener('DOMContentLoaded', function() {
    const furgone = document.getElementById('furgoneSezione1');
    const testoSezione1 = document.querySelector('.testo-sezione-1');
    
    if (!furgone || !testoSezione1) {
        console.error('Furgone o testo sezione 1 non trovato');
        return;
    }
    
    function checkFurgoneScroll() {
        const testoRect = testoSezione1.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Quando il testo entra nel viewport (70% visibile) - furgone entra e si ferma
        if (testoRect.top < windowHeight * 0.7 && testoRect.top > windowHeight * 0.2) {
            furgone.style.transform = 'translateX(-900px)';
            testoSezione1.style.opacity = '1';
        } 
        // Appena inizio a scrollare via dalla sezione - furgone continua e "cancella" il testo
        else if (testoRect.top <= windowHeight * 0.2 && testoRect.bottom > 0) {
            // Calcola quanto il furgone deve muoversi per coprire il testo
            const progress = Math.min(1, (windowHeight * 0.2 - testoRect.top) / 400);
            const translateValue = -900 - (progress * 1100);
            furgone.style.transform = `translateX(${translateValue}px)`;
            
            // Fai scomparire il testo progressivamente mentre il furgone passa
            testoSezione1.style.opacity = `${1 - progress}`;
        }
        // Completamente fuori dalla sezione - furgone completamente uscito
        else if (testoRect.bottom <= 0) {
            furgone.style.transform = 'translateX(-2000px)';
            testoSezione1.style.opacity = '0';
        }
        // Prima che il testo entri - furgone nascosto a destra
        else {
            furgone.style.transform = 'translateX(0)';
            testoSezione1.style.opacity = '0';
        }
    }
    
    window.addEventListener('scroll', checkFurgoneScroll);
    checkFurgoneScroll();
});

// Animazione testo sezione 1 (fade-in su scroll)
document.addEventListener('DOMContentLoaded', function() {
    const h2Sezione1 = document.querySelector('.h2-sezione-1');
    const testoSezione1 = document.querySelector('.testo-sezione-1');
    
    if (!h2Sezione1 || !testoSezione1) {
        console.error('Testo sezione 1 non trovato');
        return;
    }
    
    // Nascondi inizialmente
    h2Sezione1.style.opacity = '0';
    h2Sezione1.style.transform = 'translateY(30px)';
    h2Sezione1.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    testoSezione1.style.opacity = '0';
    testoSezione1.style.transform = 'translateY(30px)';
    testoSezione1.style.transition = 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s';
    
    function checkTestoSezione1Scroll() {
        const h2Rect = h2Sezione1.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Quando il titolo entra nel viewport (70% visibile)
        if (h2Rect.top < windowHeight * 0.8 && h2Rect.bottom > 0) {
            h2Sezione1.style.opacity = '1';
            h2Sezione1.style.transform = 'translateY(0)';
            testoSezione1.style.opacity = '1';
            testoSezione1.style.transform = 'translateY(0)';
        } else {
            // Nascondi quando si scrolla via dalla sezione
            h2Sezione1.style.opacity = '0';
            h2Sezione1.style.transform = 'translateY(30px)';
            testoSezione1.style.opacity = '0';
            testoSezione1.style.transform = 'translateY(30px)';
        }
    }
    
    window.addEventListener('scroll', checkTestoSezione1Scroll);
    checkTestoSezione1Scroll();
});