const seleccionarOpcionCantidad = document.querySelector("#paleta-select");
seleccionarOpcionCantidad.addEventListener("change", function () {
  const cantidadSeleccionada = parseInt(this.value);
  const paletas = document.querySelectorAll('[class^="Paleta-"]');
  paletas.forEach((paleta, posicionPaleta) => {
    const numeroPaleta = posicionPaleta + 1;
    if (numeroPaleta <= cantidadSeleccionada) {
      paleta.style.display = "block";
    } else {
      paleta.style.display = "none";
    }
  });
});

const seleccionarFormatoColor = document.querySelector("#paleta-formato");
seleccionarFormatoColor.addEventListener("change", function() {
  const formatoSeleccionado = this.value;
  console.log("Formato seleccionado: " + formatoSeleccionado);
});

// Función para generar un color aleatorio en RGB
function generarColorAleatorio() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

// Función para convertir RGB a HSL
function rgbAHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch(max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Función para obtener color en RGB como texto
function obtenerColorRGB(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

// Función para obtener color en HSL como texto
function obtenerColorHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Función para determinar si un color es claro u oscuro basado en luminancia
function obtenerColorTextoContraste(r, g, b) {
  // Fórmula de luminancia relativa
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Si la luminancia es alta (color claro), usar texto oscuro; si es baja (color oscuro), usar texto claro
  return luminancia > 0.5 ? '#000000' : '#FFFFFF';
}

const boton = document.getElementById('generar-paleta');

boton.addEventListener('click', function() {
  const cantidadSeleccionada = parseInt(document.querySelector("#paleta-select").value);
  const formatoSeleccionado = document.querySelector("#paleta-formato").value;
  
  // Validar que se haya seleccionado cantidad y formato
  if (!cantidadSeleccionada && !formatoSeleccionado) {
    alert("Por favor selecciona la cantidad de colores y el formato");
    return;
  }

  if (!cantidadSeleccionada){
    alert("Por favor selecciona la cantidad de colores");
    return;
  }

  if(!formatoSeleccionado){
    alert("Por favor selecciona el formato de color");
    return;
  }
  
  // Generar colores para cada paleta visible
  for (let trigger = 1; trigger <= cantidadSeleccionada; trigger++) {
    const colorAleatorio = generarColorAleatorio();
    const { r, g, b } = colorAleatorio;

    const paletaActual = document.querySelector(`.Paleta-${trigger}`);

    // 👇 NUEVA CONDICIÓN (si está bloqueada, saltar)
    if (paletaActual.classList.contains("bloqueado")) {
      continue;
    }
    
    // Cambiar el color del div
    const colorBox = document.querySelector(`#color${trigger}`);
    colorBox.style.backgroundColor = obtenerColorRGB(r, g, b);
    
    // Mostrar el código del color en el texto
    const textoColor = document.querySelector(`#nombre-color${trigger}`);
    const colorContraste = obtenerColorTextoContraste(r, g, b);
    
    if (formatoSeleccionado === "RGB") {
      textoColor.textContent = obtenerColorRGB(r, g, b);
    } else if (formatoSeleccionado === "HSL") {
      const { h, s, l } = rgbAHsl(r, g, b);
      textoColor.textContent = obtenerColorHSL(h, s, l);
    }
    
    // Cambiar el color del texto para que contraste
    textoColor.style.color = colorContraste;
    
    // Animación de escala
    colorBox.style.transform = "scale(1.1)";
    setTimeout(() => {
      colorBox.style.transform = "scale(1)";
    }, 200);
  }
  
});    

const cajasColores = document.querySelectorAll('[id^="color"]');

cajasColores.forEach((caja, index) => {

  caja.addEventListener("click", function () {

    const textoColor = document.querySelector(`#nombre-color${index + 1}`);

    if (!textoColor.textContent) return;

    navigator.clipboard.writeText(textoColor.textContent);

    alert("¡Color copiado al portapapeles: " + textoColor.textContent + "!");

    // Feedback visual en la caja de color
    this.style.transform = "scale(1.1)";
    this.style.transition = "0.2s ease";

    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);

  });

});

const paletas = document.querySelectorAll('[class^="Paleta-"]');

paletas.forEach(paleta => {

  const icono = document.createElement("div");
  icono.classList.add("icono-lock");
  icono.innerHTML = "🔓"; // inicia desbloqueado

  paleta.appendChild(icono);

  icono.addEventListener("click", function (e) {

    e.stopPropagation(); // 🔥 evita que el click afecte la tarjeta

    paleta.classList.toggle("bloqueado");

    // Cambiar icono según estado
    if (paleta.classList.contains("bloqueado")) {
      icono.innerHTML = "🔒";
    } else {
      icono.innerHTML = "🔓";
    }

  }); 

});