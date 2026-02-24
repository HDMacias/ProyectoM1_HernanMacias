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
seleccionarFormatoColor.addEventListener("change", function () {
  const formatoSeleccionado = this.value;
  console.log("Formato seleccionado: " + formatoSeleccionado);
});

function generarColorAleatorio() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

function rgbAHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function obtenerColorRGB(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

function obtenerColorHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function obtenerColorTextoContraste(r, g, b) {
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminancia > 0.5 ? "#000000" : "#FFFFFF";
}

const boton = document.getElementById("generar-paleta");

boton.addEventListener("click", function () {
  const cantidadSeleccionada = parseInt(
    document.querySelector("#paleta-select").value,
  );
  const formatoSeleccionado = document.querySelector("#paleta-formato").value;

  if (!cantidadSeleccionada && !formatoSeleccionado) {
    alert("Por favor selecciona la cantidad de colores y el formato");
    return;
  }

  if (!cantidadSeleccionada) {
    alert("Por favor selecciona la cantidad de colores");
    return;
  }

  if (!formatoSeleccionado) {
    alert("Por favor selecciona el formato de color");
    return;
  }

  alert(`Paleta de colores Generada`);

  for (let trigger = 1; trigger <= cantidadSeleccionada; trigger++) {
    const colorAleatorio = generarColorAleatorio();
    const { r, g, b } = colorAleatorio;

    const paletaActual = document.querySelector(`.Paleta-${trigger}`);

    if (paletaActual.classList.contains("bloqueado")) {
      continue;
    }

    const colorBox = document.querySelector(`#color${trigger}`);
    colorBox.style.backgroundColor = obtenerColorRGB(r, g, b);

    const textoColor = document.querySelector(`#nombre-color${trigger}`);
    const colorContraste = obtenerColorTextoContraste(r, g, b);

    if (formatoSeleccionado === "RGB") {
      textoColor.textContent = obtenerColorRGB(r, g, b);
    } else if (formatoSeleccionado === "HSL") {
      const { h, s, l } = rgbAHsl(r, g, b);
      textoColor.textContent = obtenerColorHSL(h, s, l);
    }

    textoColor.style.color = colorContraste;

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

    this.style.transform = "scale(1.1)";
    this.style.transition = "0.2s ease";

    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);
  });
});

const paletas = document.querySelectorAll('[class^="Paleta-"]');

paletas.forEach((paleta) => {
  const icono = document.createElement("div");
  icono.classList.add("icono-lock");
  icono.innerHTML = "🔓";

  paleta.appendChild(icono);

  icono.addEventListener("click", function (e) {
    e.stopPropagation();

    paleta.classList.toggle("bloqueado");

    if (paleta.classList.contains("bloqueado")) {
      icono.innerHTML = "🔒";
    } else {
      icono.innerHTML = "🔓";
    }
  });
});
