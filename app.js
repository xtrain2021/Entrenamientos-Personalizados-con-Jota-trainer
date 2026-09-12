/* ======================================= */
/* ====== LÓGICA GENERAL DEL PROYECTO ===== */
/* ======================================= */

/* Evita duplicar eventos, intervalos y observadores si app.js se carga más de una vez. */
if (!window.__personalTrainerJJAppInitialized) {
    window.__personalTrainerJJAppInitialized = true;

    /* ======================================= */
    /* ====== LÓGICA DEL MENÚ RESPONSIVO ===== */
    /* ======================================= */

    const menuManager = {
        menuVisible: false,
        navElement: null,
        headerElement: null,

        init: function() {
            this.navElement = document.getElementById("nav");
            this.headerElement = this.navElement ? this.navElement.closest("header") : null;
        },

        toggleMenu: function() {
            if (!this.navElement) return;

            this.menuVisible = !this.menuVisible;
            this.navElement.classList.toggle("responsive", this.menuVisible);

            if (this.headerElement) {
                this.headerElement.classList.toggle("responsive", this.menuVisible);
            }
        },

        hideMenu: function() {
            if (!this.navElement) return;

            this.navElement.classList.remove("responsive");

            if (this.headerElement) {
                this.headerElement.classList.remove("responsive");
            }

            this.menuVisible = false;
        }
    };

    /* ======================================= */
    /* ============ UTILIDADES =============== */
    /* ======================================= */

    const appState = {
        currentSlide: 0,
        sliderInterval: null,
        scrollTicking: false,
        prefersReducedMotion: false
    };

    const appSelectors = {
        navBtn: "nav-responsive-btn",
        navLinks: "#nav a",
        slides: ".slide",
        prevBtn: ".prev",
        nextBtn: ".next",
        dots: ".dot",
        animatedElements: ".animate-fade-in, .animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right, .animate-zoom-in",
        sections: "section[id]",
        btnArriba: "btnArriba",
        contactForm: ".contact-form",
        testimoniosTrack: ".testimonios-track"
    };

    /* ======================================= */
    /* ================= AOS ================= */
    /* ======================================= */

    function initAOS() {
        if (!window.AOS) return;

        AOS.init({
            duration: appState.prefersReducedMotion ? 0 : 1000,
            once: true,
            offset: 100,
            easing: "ease-out-cubic"
        });
    }

    /* ======================================= */
    /* ================= GSAP ================ */
    /* ======================================= */

    function initGSAP() {
        if (!window.gsap) return;

        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    /* ======================================= */
    /* =============== MENÚ ================== */
    /* ======================================= */

    function initMenu() {
        const navBtn = document.getElementById(appSelectors.navBtn);
        const navLinks = document.querySelectorAll(appSelectors.navLinks);

        menuManager.init();

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
    }

    /* ======================================= */
    /* ============ HERO SLIDER ============== */
    /* ======================================= */

    function initHeroSlider() {
        const slides = document.querySelectorAll(appSelectors.slides);
        const prevBtn = document.querySelector(appSelectors.prevBtn);
        const nextBtn = document.querySelector(appSelectors.nextBtn);
        const dots = document.querySelectorAll(appSelectors.dots);
        const totalSlides = slides.length;

        if (!totalSlides) return;

        function showSlide(index) {
            appState.currentSlide = (index + totalSlides) % totalSlides;

            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === appState.currentSlide);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === appState.currentSlide);
            });
        }

        function nextSlide() {
            showSlide(appState.currentSlide + 1);
        }

        function prevSlide() {
            showSlide(appState.currentSlide - 1);
        }

        function restartSlider() {
            if (appState.prefersReducedMotion || totalSlides <= 1) return;

            clearInterval(appState.sliderInterval);
            appState.sliderInterval = setInterval(nextSlide, 5000);
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextSlide();
                restartSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevSlide();
                restartSlider();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                restartSlider();
            });
        });

        showSlide(appState.currentSlide);
        restartSlider();
    }

    /* ======================================= */
    /* ============== TESTIMONIOS ============ */
    /* ======================================= */

    function initTestimonios() {
        const testimoniosTrack = document.querySelector(appSelectors.testimoniosTrack);

        if (!testimoniosTrack) return;

        /* Módulo reservado para futuras interacciones sin modificar el HTML actual. */
        testimoniosTrack.setAttribute("aria-live", "polite");
    }

    /* ======================================= */
    /* ======= ANIMACIONES AL SCROLL ========= */
    /* ======================================= */

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(appSelectors.animatedElements);

        if (!animatedElements.length) return;

        if (!("IntersectionObserver" in window) || appState.prefersReducedMotion) {
            animatedElements.forEach(element => element.classList.add("visible"));
            return;
        }

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: "0px 0px -100px 0px"
        });

        animatedElements.forEach(element => appearOnScroll.observe(element));
    }

    /* ======================================= */
    /* ======= BOTÓN VOLVER ARRIBA =========== */
    /* ======================================= */

    function updateBackToTopButton(btnArriba, scrollPosition) {
        if (!btnArriba) return;

        btnArriba.classList.toggle("mostrar", scrollPosition > 500);
    }

    /* ======================================= */
    /* ========== MENÚ ACTIVO SCROLL ========= */
    /* ======================================= */

    function updateActiveMenu(navLinks, sections, scrollPosition) {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;

            if (scrollPosition >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle("activo", link.getAttribute("href") === `#${current}`);
        });
    }

    /* ======================================= */
    /* ================ SCROLL =============== */
    /* ======================================= */

    function initScroll() {
        const btnArriba = document.getElementById(appSelectors.btnArriba);
        const navLinks = document.querySelectorAll(appSelectors.navLinks);
        const sections = document.querySelectorAll(appSelectors.sections);

        const updateOnScroll = () => {
            const scrollPosition = window.scrollY;

            updateBackToTopButton(btnArriba, scrollPosition);
            updateActiveMenu(navLinks, sections, scrollPosition);

            appState.scrollTicking = false;
        };

        window.addEventListener("scroll", () => {
            if (!appState.scrollTicking) {
                window.requestAnimationFrame(updateOnScroll);
                appState.scrollTicking = true;
            }
        }, { passive: true });

        updateOnScroll();
    }

    /* ======================================= */
    /* ============== FORMULARIO ============= */
    /* ======================================= */

    function initFormulario() {
        const form = document.querySelector(appSelectors.contactForm);

        if (!form) return;

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            })
            .then(response => {
                if (response.ok) {
                    alert("Mensaje enviado con éxito. ¡Gracias!");
                    form.reset();
                    return;
                }

                alert("Ocurrió un error. Inténtalo nuevamente.");
            })
            .catch(() => {
                alert("Error de conexión. Inténtalo nuevamente.");
            });
        });
    }

    /* ======================================= */
    /* ========== DOM READY (TODO) ============ */
    /* ======================================= */

    document.addEventListener("DOMContentLoaded", () => {
        appState.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        initAOS();
        initGSAP();
        initMenu();
        initHeroSlider();
        initTestimonios();
        initScrollAnimations();
        initScroll();
        initFormulario();
    });
}
// --- FUNCIONALIDAD DEL SLIDER DE TESTIMONIOS ---
const track = document.querySelector('.testimonios-track');
const cards = document.querySelectorAll('.testimonio-card');
const btnPrev = document.getElementById('prevTestimonio');
const btnNext = document.getElementById('nextTestimonio');

let indexActual = 0;

function actualizarSlider() {
    const anchoTarjeta = cards[0].getBoundingClientRect().width; // Toma el ancho exacto de una tarjeta
    track.style.transform = `translateX(-${indexActual * anchoTarjeta}px)`;
}


if(btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
        if (indexActual < cards.length - 1) {
            indexActual++;
        } else {
            indexActual = 0; // Regresa al inicio si llega al final
        }
        actualizarSlider();
    });

    btnPrev.addEventListener('click', () => {
        if (indexActual > 0) {
            indexActual--;
        } else {
            indexActual = cards.length - 1; // Va al final si retrocede desde el inicio
        }
        actualizarSlider();
    });
}
// --- LÓGICA DE FORMULARIO INTELIGENTE Y SANITIZACIÓN ANTI-XSS ---
const selectorServicio = document.getElementById('servicio_interes');
const contenedorDinamico = document.getElementById('campos-dinamicos');
const formulario = document.getElementById('form-inteligente');

// Función para limpiar caracteres peligrosos (Anti-XSS e Inyecciones)
function sanitizarEntrada(texto) {
    const mapaCaracteres = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "\\": '&#x5C;'
    };
    return texto.replace(/[&<>"'\/\\;]/g, (s) => mapaCaracteres[s]).trim();
}

// Escuchar cambios en el selector de servicios
if (selectorServicio && contenedorDinamico) {
    selectorServicio.addEventListener('change', (e) => {
        const seleccion = e.target.value;
        contenedorDinamico.innerHTML = ''; // Limpiar campos previos

        if (seleccion === 'funcional') {
            contenedorDinamico.innerHTML = `
                <div class="col"><input type="number" name="edad" placeholder="Tu Edad" required min="1" max="100"></div>
                <div class="col"><input type="text" name="objetivo" placeholder="Objetivo (Bajar peso, masa, salud)" required></div>
                <div class="col"><input type="text" name="frecuencia_semanal" placeholder="¿Cuántas veces por semana?" required></div>
                <div class="col"><input type="text" name="horario_preferido" placeholder="Horario ideal (Mañana, Tarde, Noche)" required></div>
            `;
        } else if (seleccion === 'artes_marciales') {
            contenedorDinamico.innerHTML = `
                <div class="col"><input type="text" name="experiencia_previa" placeholder="¿Tienes experiencia en artes marciales? (Sí/No)" required></div>
                <div class="col"><input type="text" name="lesiones" placeholder="¿Tienes alguna lesión física?" required></div>
            `;
        } else if (seleccion === 'pausas_activas') {
            contenedorDinamico.innerHTML = `
                <div class="col"><input type="text" name="empresa_nombre" placeholder="Nombre de la Empresa" required></div>
                <div class="col"><input type="number" name="numero_empleados" placeholder="Número de empleados aprox." required min="1"></div>
            `;
        }
    });
}

// Validación y desinfección antes del envío
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        const inputs = formulario.querySelectorAll('input, textarea, select');
        let formularioValido = true;

        inputs.forEach(input => {
            // Sanitizar valores de texto
            if (input.type === 'text' || input.tagName === 'TEXTAREA') {
                input.value = sanitizarEntrada(input.value);
            }
            
            // Validar teléfono estrictamente (solo números)
            if (input.id === 'telefono') {
                const telefonoLimpio = input.value.replace(/\D/g, ''); // Quita lo que no sea número
                if (telefonoLimpio.length < 7 || telefonoLimpio.length > 15) {
                    alert('Por favor, ingresa un número de teléfono o WhatsApp válido.');
                    formularioValido = false;
                } else {
                    input.value = telefonoLimpio;
                }
            }
        });

        if (!formularioValido) {
            e.preventDefault(); // Detiene el envío si hay errores
        }
    });
}
// --- AUTO-SELECCIÓN DE SERVICIO DESDE EL CARRUSEL DE VIDEOS ---
const botonesVideoCta = document.querySelectorAll('.btn-video-cta');
const selectorFormulario = document.getElementById('servicio_interes');

if (botonesVideoCta.length > 0 && selectorFormulario) {
    botonesVideoCta.addEventListener('click', function(e) {
        // Obtenemos el tipo de servicio configurado en el botón
        const servicioAsociado = this.getAttribute('data-servicio');
        
        // Asignamos el valor al selector de tu formulario inteligente
        selectorFormulario.value = servicioAsociado;
        
        // Forzamos el evento 'change' para que JavaScript dibuje las preguntas dinámicas (edad, objetivo, etc.)
        const eventoChange = new Event('change');
        selectorFormulario.dispatchEvent(eventoChange);
    });
}


