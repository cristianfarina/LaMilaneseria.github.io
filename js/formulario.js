// Capturar los elementos de interés del DOM
const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");
const modalPedido = document.querySelector(".modal-pedido");
const cerrarModalPedido = document.querySelector(".modal-pedido__cerrar");
const ocultarUbicacion = document.querySelector(".responsive-iframe");

// Expresiones regulares
const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{3,16}$/, // Letras y espacios, pueden llevar acentos.
  direccion: /^[a-zA-ZÀ-ÿ0-9\s\_\-]{4,60}$/, // Letras, numeros, guion y guion_bajo
  correo:
    /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i,
  telefono: /^\d{7,12}$/, // 7 a 12 numeros.
};

// Objeto para validar campos en formulario
const campos = {
  nombre: false,
  direccion: false,
  correo: false,
  telefono: false,
};

// Declarar fn para validar formulario
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

// Declarar fn para validar cada campo del formulario
const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value)) {
    // Campo validado correctamente
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
    // Campo no valido
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

// Recorrer los inputs del formulario, y en cada input, asociar los eventos "keyup" y "blur" a la función 'validarFormulario'
inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

// Asociar el evento 'submit'
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  // Verificar que el carrito no esté vacio
  if (Object.keys(carrito).length === 0) {
    // Mensaje 'agregue algún producto al carrito'
    document
      .getElementById("formulario__mensaje-carrito")
      .classList.add("formulario__mensaje-activo");
    // Ocultar mensaje luego de 5 segundos
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje-carrito")
        .classList.remove("formulario__mensaje-activo");
    }, 5000);
    return;
  }

  // Verificar formulario completo
  if (campos.nombre && campos.direccion && campos.correo && campos.telefono) {
    // Cargar mensaje en Modal
    const mensajeFinal = `Muchas gracias por tu compra ${inputs[0].value}!! En los próximos minutos estaremos enviando tu pedido a ${inputs[1].value}.`;
    const detallePedido = document.getElementById("detalle-pedido");
    detallePedido.innerHTML = mensajeFinal;

    // Mostrar Modal
    modalPedido.classList.add("modal-pedido--activo");
    ocultarUbicacion.classList.add("ubicacion--inactivo");

    // Setear los campos en 'false'
    campos.nombre = false;
    campos.direccion = false;
    campos.correo = false;
    campos.telefono = false;

    // Quitar iconos de validación
    document
      .querySelectorAll(".formulario__grupo-correcto")
      .forEach((icono) => {
        icono.classList.remove("formulario__grupo-correcto");
      });

    // Resetear formulario, vaciar carrito, limpiar Storage y volver a pintar carrito
    formulario.reset();
    carrito = {};
    localStorage.clear();
    pintarProductosEnCarrito();
  } else {
    // Mensaje 'complete el formulario'
    document
      .getElementById("formulario__mensaje")
      .classList.add("formulario__mensaje-activo");
    // Ocultar mensaje luego de 5 segundos
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje")
        .classList.remove("formulario__mensaje-activo");
    }, 5000);
  }
});

// Cerrar Modal de Confirmación de pedido
cerrarModalPedido.addEventListener("click", (e) => {
  e.preventDefault();
  modalPedido.classList.remove("modal-pedido--activo");
  ocultarUbicacion.classList.remove("ubicacion--inactivo");
});
