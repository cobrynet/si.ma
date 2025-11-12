// Animazione del testo Coming Soon - cambio colore da blu scuro a celeste
document.addEventListener('DOMContentLoaded', function() {
    const comingSoonTitle = document.getElementById('coming-soon-title');
    
    if (comingSoonTitle) {
        let isBlue = true;
        
        // Alterna tra blu scuro e celeste ogni secondo
        setInterval(function() {
            if (isBlue) {
                comingSoonTitle.style.color = '#00A3E0'; // Celeste
            } else {
                comingSoonTitle.style.color = '#003D82'; // Blu scuro
            }
            isBlue = !isBlue;
        }, 1000); // Cambia ogni secondo
    }
});
