// --- CONFIGURACIÓN DE LA CONSTELACIÓN DE PARTÍCULAS 3D ---
const canvas = document.getElementById('fondo-3d-particulas');
const ctx = canvas.getContext('2d');

let particulas = [];
const numeroParticulas = 85; // Cantidad equilibrada para que sea súper ligero
const mouse = { x: null, y: null, radio: 140 }; // Radio de interacción del cursor

// Ajustar el lienzo al tamaño de la pantalla
function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
ajustarPantalla();
window.addEventListener('resize', ajustarPantalla);

// Rastrear el movimiento del mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Resetear el mouse si sale de la ventana
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Clase para crear cada punto de energía
class Particula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2; // Velocidad X suave
        this.vy = (Math.random() - 0.5) * 1.2; // Velocidad Y suave
        this.radio = Math.random() * 2 + 1;    // Tamaño del punto
    }

    dibujar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Puntos blancos sutiles
        ctx.fill();
    }

    actualizar() {
        // Mover partículas
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar en los bordes de la pantalla
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Interactividad: Efecto repulsión con el mouse
        if (mouse.x != null && mouse.y != null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia < mouse.radio) {
                let fuerza = (mouse.radio - distancia) / mouse.radio;
                let dirX = dx / distancia;
                let dirY = dy / distancia;
                this.x += dirX * fuerza * 4; // Empujón fluido
                this.y += dirY * fuerza * 4;
            }
        }
        this.dibujar();
    }
}

// Inicializar el arreglo de puntos
function iniciar() {
    particulas = [];
    for (let i = 0; i < numeroParticulas; i++) {
        particulas.push(new Particula());
    }
}
iniciar();

// Dibujar las líneas que conectan los puntos (Efecto Red Kinetic)
function conectar() {
    let opacidad;
    for (let a = 0; a < particulas.length; a++) {
        for (let b = a; b < particulas.length; b++) {
            let dx = particulas[a].x - particulas[b].x;
            let dy = particulas[a].y - particulas[b].y;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            // Si los puntos están cerca, dibuja una línea sutil entre ellos
            if (distancia < 120) {
                opacidad = (1 - (distancia / 120)) * 0.15; // Muy transparente para no estorbar la lectura
                ctx.strokeStyle = `rgba(219, 48, 34, ${opacidad})`; // Líneas rojas (Color de tu marca Trainer JJ)
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particulas[a].x, particulas[a].y);
                ctx.lineTo(particulas[b].x, particulas[b].y);
                ctx.stroke();
            }
        }
    }
}

// Bucle de animación infinito de alto rendimiento (60fps estables)
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particulas.length; i++) {
        particulas[i].actualizar();
    }
    conectar();
    requestAnimationFrame(animar);
}
animar();
