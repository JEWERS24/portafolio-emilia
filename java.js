document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    const follower = document.querySelector('.follower');
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    document.body.appendChild(particlesContainer);

    document.addEventListener('mousemove', function (e) {
        const x = e.clientX;
        const y = e.clientY;

        follower.style.left = `${x}px`;
        follower.style.top = `${y + window.scrollY}px`;

        // Crear partículas
        createParticle(x, y);
    });

    // Función para crear partículas
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particlesContainer.appendChild(particle);

        // Establecer la posición de la partícula
        particle.style.left = `${x}px`;
        particle.style.top = `${y + window.scrollY}px`;

        // Eliminar la partícula después de un tiempo
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
});
