// Servizi slider mobile functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.servizi-slider-mobile');
    
    // Exit if slider doesn't exist (not on servizi page or desktop view)
    if (!slider) return;
    
    const cards = document.querySelectorAll('.servizi-card');
    const dots = document.querySelectorAll('.servizi-dot');
    let currentSlide = 0;
    let startX = 0;
    let isDragging = false;

    function showSlide(index) {
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Touch events for mobile
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
        
        // If swipe is significant enough (more than 50px)
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < cards.length - 1) {
                // Swiped left, go to next slide
                showSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                // Swiped right, go to previous slide
                showSlide(currentSlide - 1);
            }
        }
        
        isDragging = false;
    });

    // Mouse events for desktop testing
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < cards.length - 1) {
                showSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }
        
        isDragging = false;
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
});
