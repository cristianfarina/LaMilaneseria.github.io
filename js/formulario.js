const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");

const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{3,16}$/, // Letras y espacios, pueden llevar acentos.
  direccion: /^[a-zA-Z0-9\_\-]{4,20}$/, // Letras, numeros, guion y guion_bajo
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d{7,12}$/, // 7 a 12 numeros.
};

const campos = {
  nombre: false,
  direccion: false,
  correo: false,
  telefono: false,
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombre":
      validarCampo(expresiones.nombre, e.target, e.target.name);
      break;
    case "direccion":
      validarCampo(expresiones.direccion, e.target, e.target.name);
      break;
    case "correo":
      validarCampo(expresiones.correo, e.target, e.target.name);
      break;
    case "telefono":
      validarCampo(expresiones.telefono, e.target, e.target.name);
      break;
  }
};

const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value)) {
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-circle-xmark");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-circle-check");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos[campo] = true;
  } else {
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-circle-xmark");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-circle-check");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos[campo] = false;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  if (Object.keys(carrito).length === 0) {
    document
      .getElementById("formulario__mensaje-carrito")
      .classList.add("formulario__mensaje-activo");
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje-carrito")
        .classList.remove("formulario__mensaje-activo");
    }, 5000);
    return;
  }

  if (campos.nombre && campos.direccion && campos.correo && campos.telefono) {
    formulario.reset();
    /* campos.nombre = false;
    campos.direccion = false;
    campos.correo = false;
    campos.telefono = false; 
    console.log("campos: ", campos);*/
    document
      .getElementById("formulario__mensaje-exito")
      .classList.add("formulario__mensaje-exito-activo");
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje-exito")
        .classList.remove("formulario__mensaje-exito-activo");
    }, 5000);

    campos.nombre = false;
    campos.direccion = false;
    campos.correo = false;
    campos.telefono = false;
    console.log("campos: ", campos);

    document
      .querySelectorAll(".formulario__grupo-correcto")
      .forEach((icono) => {
        icono.classList.remove("formulario__grupo-correcto");
      });

    carrito = {};  
    localStorage.clear();
    pintarProductosEnCarrito();
    
  } else {
    document
      .getElementById("formulario__mensaje")
      .classList.add("formulario__mensaje-activo");
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje")
        .classList.remove("formulario__mensaje-activo");
    }, 5000);
  }
});
