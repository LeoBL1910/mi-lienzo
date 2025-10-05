// === Seleccionamos elementos ===
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizePicker = document.getElementById('size');
const clearBtn = document.getElementById('clear');

// === Ajustar tamaño del canvas ===
function resizeCanvas() {
  const img = new Image();
  img.src = canvas.toDataURL(); // Guarda dibujo temporalmente
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Redibuja lo que había (para no perderlo al redimensionar)
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// === Variables de dibujo ===
let dibujando = false;
let x = 0, y = 0;

// === Cargar dibujo guardado (si existe) ===
const saved = localStorage.getItem('dibujoGuardado');
if (saved) {
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.src = saved;
}

// === Función para guardar el dibujo ===
function guardarDibujo() {
  try {
    const dataURL = canvas.toDataURL(); // Convierte el dibujo en texto base64
    localStorage.setItem('dibujoGuardado', dataURL);
  } catch (err) {
    console.error("No se pudo guardar el dibujo:", err);
  }
}

// === Eventos del dibujo ===
canvas.addEventListener('mousedown', e => {
  dibujando = true;
  [x, y] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', e => {
  dibujando = false;
  guardarDibujo(); // Guarda cuando sueltas el ratón
});

canvas.addEventListener('mousemove', e => {
  if (!dibujando) return;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = sizePicker.value;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  [x, y] = [e.offsetX, e.offsetY];
});

// === Botón de limpiar ===
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem('dibujoGuardado'); // Borra el dibujo guardado
});

// === Guardar automáticamente al salir ===
window.addEventListener('beforeunload', guardarDibujo);
