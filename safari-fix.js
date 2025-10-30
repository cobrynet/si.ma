// Fix Safari Desktop Responsive
(function() {
    // Rileva Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari && window.innerWidth >= 1025 && window.innerWidth < 1728) {
        // Calcola lo scale factor
        const scaleFactor = window.innerWidth / 1728;
        
        // Applica zoom ai container principali
        const containers = [
            document.querySelector('.home'),
            document.querySelector('.main-container-contatti'),
            document.querySelector('.main-container-sezione2')
        ];
        
        containers.forEach(container => {
            if (container) {
                container.style.zoom = scaleFactor;
                container.style.width = '1728px';
            }
        });
        
        // Nascondi overflow orizzontale
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.body.style.width = '100vw';
        
        console.log('Safari fix applicato - scale:', scaleFactor);
    }
})();
