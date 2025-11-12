// Story Slider - Gestione swipe e navigazione dots
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.story-slider-mobile');
    if (!slider) return;

    const cards = slider.querySelectorAll('.story-card');
    const dots = slider.querySelectorAll('.story-dot');
    let currentSlide = 0;
    let startX = 0;
    let isDragging = false;

    // Funzione per mostrare slide specifica
    function showSlide(index) {
        // Rimuovi active da tutte le card e dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Aggiungi active alla card e dot correnti
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Click sui dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Touch events per swipe
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
    });

    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        // Swipe left (mostra prossima card)
        if (diff > 50 && currentSlide < cards.length - 1) {
            showSlide(currentSlide + 1);
        }
        // Swipe right (mostra card precedente)
        else if (diff < -50 && currentSlide > 0) {
            showSlide(currentSlide - 1);
        }

        isDragging = false;
    });

    // Mouse events per desktop testing
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        e.preventDefault();
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const diff = startX - endX;

        if (diff > 50 && currentSlide < cards.length - 1) {
            showSlide(currentSlide + 1);
        }
        else if (diff < -50 && currentSlide > 0) {
            showSlide(currentSlide - 1);
        }

        isDragging = false;
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
    });
});
