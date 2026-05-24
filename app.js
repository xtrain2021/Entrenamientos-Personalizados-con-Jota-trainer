/* ======================================= */
/* ====== LÓGICA DEL MENÚ RESPONSIVO ===== */
/* ======================================= */

const menuManager = {
    menuVisible: false,

    toggleMenu: function() {
        const navElement = document.getElementById("nav");
        this.menuVisible = !this.menuVisible;
        
        if (this.menuVisible) {
            navElement.classList.add("responsive");
        } else {
            navElement.classList.remove("responsive");
        }
    },
    
    hideMenu: function() {
        const navElement = document.getElementById("nav");
        navElement.classList.remove("responsive");
        this.menuVisible = false;
    }
};


/* ======================================= */
/* ========== DOM READY (TODO) ============ */
/* ======================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===== MENÚ ===== */
    const navBtn = document.getElementById("nav-responsive-btn");
    const navLinks = document.querySelectorAll("#nav a");

    if (navBtn) {
        navBtn.addEventListener("click", () => {
            menuManager.toggleMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuManager.hideMenu();
        });
    });


    /* ===== SLIDER ===== */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    if (totalSlides > 0) {
        setInterval(nextSlide, 5000);
    }


    /* ===== ANIMACIONES SCROLL ===== */
    const faders = document.querySelectorAll('.animate-fade-in, .animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right, .animate-zoom-in');

    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(el => appearOnScroll.observe(el));


    /* ===== BOTÓN VOLVER ARRIBA ===== */
    const btnArriba = document.getElementById('btnArriba');

    if (btnArriba) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btnArriba.classList.add('mostrar');
            } else {
                btnArriba.classList.remove('mostrar');
            }
        });
    }


    /* ===== MENÚ ACTIVO SEGÚN SCROLL ===== */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('activo');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('activo');
            }
        });
    });


    /* ===== FORMULARIO ===== */
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    alert("Mensaje enviado con éxito. ¡Gracias!");
                    form.reset();
                } else {
                    alert("Ocurrió un error. Inténtalo nuevamente.");
                }
            })
            .catch(() => {
                alert("Error de conexión. Inténtalo nuevamente.");
            });
        });
    }

});