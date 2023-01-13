// Declarar el objeto carrito, e inicializarlo vacio
let carrito = {}; //Tendrá la forma { producto.id : {producto} }

// Recuperar el carrito del LocalStorage
let carritoRecuperado = localStorage.getItem("carrito");

// Capturar el contenedor del footer del carrito
const footerCarrito = document.getElementById("footer-carrito");
// Declarar función para pintar el footer del carrito
const pintarFooterCarrito = () => {
  //Vaciar contenido del footer del carrito
  footerCarrito.innerHTML = "";
  // Si el carrito está vacío, escribimos un mensaje en el footer y salimos. Para esto, convertimos el objeto carrito en un array que contenga sus claves ('keys') y usamos la propiedad 'length' sobre él.
  if (Object.keys(carrito).length === 0) {
    // Creamos el elemento <th>
    const th = document.createElement("th");
    // Agregamos el atributo scope
    th.scope = "row";
    // Agregamos el atributo colSpan
    th.colSpan = 5;
    // Agregamos texto a th
    th.textContent = "Carrito vacío - agrega tus menus!";
    // Agregamos el nodo hijo al footer del carrito
    footerCarrito.appendChild(th);
    // Salimos de la función pintarFooterCarrito()
    return;
  }

  // MODIFICAR EL TEMPLATE DEL FOOTER DEL CARRITO CON LA INFORMACIÓN DE TODOS LOS PRODUCTOS DEL CARRITO
  // Capturar el contenido del template footer del carrito (Document Fragment)
  const template = document.getElementById("template-footer").content;
  // Crear un fragment, y usarlo para evitar el reflow
  const fragment = document.createDocumentFragment();

  // Sumar cantidad. Convertimos la colección de objetos del carrito en un array, para usar el método reduce( (acumulador, elemento a iterar) => operación , valor inicial ). El elemento a iterar es un objeto, y de él nos interesa la propiedad 'cantidad'
  const nCantidad = Object.values(carrito).reduce(
    (acumulador, { cantidad }) => acumulador + cantidad,
    0
  );
  // Sumar totales. Convertimos la colección de objetos del carrito en un array, para usar el método reduce( (acumulador, elemento a iterar) => operación , valor inicial ). El elemento a iterar es un objeto, y de él nos interesa las propiedades 'cantidad' y 'precio'
  const nTotal = Object.values(carrito).reduce(
    (acumulador, { cantidad, precio }) => acumulador + cantidad * precio,
    0
  );
  //--> console.log(nTotal);

  // Capturar dentro del template, todos los elementos que contengan la etiqueta 'td', y asignarle la cantidad total de productos del carrito al contenido de su primer elemento
  template.querySelectorAll("td")[0].textContent = nCantidad;
  // Capturar dentro del template, el elemento que contiene la etiqueta 'span', y asignarle el monto total del carrito a su contenido
  template.querySelector("span").textContent = nTotal;

  // Clonar el template y sus nodos hijos
  const clon = template.cloneNode(true);
  // Agregar el clon al fragment para ir almacenando la estructura (de esta forma, no se incorpora aún al DOM, para evitar reflow)
  fragment.appendChild(clon);
  // Agregar el fragment al contenedor del footer del carrito (incorporar estructura al DOM)
  footerCarrito.appendChild(fragment);

  // Asociar el evento 'click' del botón vaciar, a una función para vaciar el carrito
  const botonVaciar = document.getElementById("vaciar-carrito");
  botonVaciar.addEventListener("click", () => {
    // Asignamos un objeto vacio a carrito
    carrito = {};
    // Vaciar el LocalStorage
    localStorage.clear();
    // Llamar a la función pintarProductosEnCarrito para actualizar el contenido del carrito
    pintarProductosEnCarrito();
  });
};

// Declarar una función para detectar los botones con la acción '+' y '-' (aumentar y disminuir la cantidad de un producto del carrito, respectivamente), y asociarlos con un evento que capture el click
const accionBotones = () => {
  // Capturar dentro del elemento del document que contienen el id 'items' (body del carrito), todos los elementos que contengan la clase "btn-info" (botones '+'), y los cargamos en el array botonesAumentar
  const botonesAumentar = document.querySelectorAll("#items .btn-info");
  // Capturar dentro del elemento del document que contienen el id 'items' (body del carrito), todos los elementos que contengan la clase "btn-danger" (botones '-'), y los cargamos en el array botonesDisminuir
  const botonesDisminuir = document.querySelectorAll("#items .btn-danger");

  // Recorrer el array de botonesAumentar
  botonesAumentar.forEach((unBotonAumentar) => {
    // Asociar el evento 'click' de cada botón a una función para aumentar la cantidad de un producto del carrito
    unBotonAumentar.addEventListener("click", () => {
      //--> console.log(unBotonAumentar.dataset.id);
      // Detectar el producto. Accedo directamente al atributo [unBotonAumentar.dataset.id] del objeto carrito y lo guardo en 'unProducto'
      const unProducto = carrito[unBotonAumentar.dataset.id];
      // A la cantidad previa del producto correspondiente, le sumo 1
      unProducto.cantidad++;
      // Agregamos una copia de 'unProducto' (con spread operator), en el atributo 'unBotonAumentar.dataset.id' del carrito, sobreescribiendo el objeto existente.
      carrito[unBotonAumentar.dataset.id] = { ...unProducto };
      // Guardar carrito en LocalStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      // Llamar a la función pintarProductosEnCarrito para actualizar el contenido del carrito
      pintarProductosEnCarrito();
    });
  });

  // Recorrer el array de botonesDisminuir
  botonesDisminuir.forEach((unBotonDisminuir) => {
    // Asociar el evento 'click' de cada botón a una función para disminuir la cantidad de un producto del carrito
    unBotonDisminuir.addEventListener("click", () => {
      //--> console.log(unBotonDisminuir.dataset.id);
      // Detectar el producto. Accedo directamente al atributo [unBotonDisminuir.dataset.id] del objeto carrito y lo guardo en 'unProducto'
      const unProducto = carrito[unBotonDisminuir.dataset.id];
      // A la cantidad previa del producto correspondiente, le resto 1
      unProducto.cantidad--;
      // Uso de operador ternario. Después de restar una unidad, si la cantidad es igual a cero, borro esa propiedad (item) del objeto carrito. Sino, agregamos una copia de 'unProducto' (con spread operator), en el atributo 'unBotonDisminuir.dataset.id' del carrito, sobreescribiendo el objeto existente.
      unProducto.cantidad === 0
        ? delete carrito[unBotonDisminuir.dataset.id]
        : (carrito[unBotonDisminuir.dataset.id] = { ...unProducto });
      // Uso de operador ternario. Si el carrito quedó sin productos, vaciar el LocalStorage, sino guardarlo en él
      Object.keys(carrito).length === 0
        ? localStorage.clear()
        : localStorage.setItem("carrito", JSON.stringify(carrito));
      // Llamar a la función pintarProductosEnCarrito para actualizar el contenido del carrito
      pintarProductosEnCarrito();
    });
  });
};

// Capturar el contenedor de items del carrito
const items = document.getElementById("items");
// Declarar función para pintar productos en el carrito
const pintarProductosEnCarrito = () => {
  //Vaciar contenido del carrito
  items.innerHTML = "";

  // MODIFICAR EL TEMPLATE DE ITEMS DEL CARRITO CON LA INFORMACIÓN DE LOS PRODUCTOS AGREGADOS
  // Capturar del document, el contenido del template carrito (Document Fragment)
  const template = document.getElementById("template-carrito").content;
  // Crear un fragment -esta vez, usando el constructor-, y usarlo para evitar el reflow
  const fragment = new DocumentFragment();

  // Transformar el objeto 'carrito' en un array que contenga los valores ('values') del objeto, y recorrerlo
  Object.values(carrito).forEach((unProducto) => {
    //--> console.log('unProducto', unProducto);
    // MODIFICAR EL TEMPLATE CON LA INFORMACIÓN DE CADA PRODUCTO
    // Capturar dentro del template, el elemento que contiene la etiqueta 'th', y asignarle el id a su contenido
    template.querySelector("th").textContent = unProducto.id;
    // Capturar dentro del template, todos los elementos que contengan la etiqueta 'th', y asignarle el nombre al contenido de su primer elemento
    template.querySelectorAll("td")[0].textContent = unProducto.nombre;
    // Capturar dentro del template, todos los elementos que contengan la etiqueta 'th', y asignarle la cantidad al contenido de su segundo elemento
    template.querySelectorAll("td")[1].textContent = unProducto.cantidad;
    // Capturar dentro del template, el elemento que contiene la etiqueta 'span', y asignarle el Subtotal (precio*cantidad) a su contenido
    template.querySelector("span").textContent =
      unProducto.precio * unProducto.cantidad;

    //BOTONES
    // Capturar dentro del template, el elemento que contiene la clase "btn-info", y asignarle un id con dataset(data-id="id"), para luego poder asociar el botón '+' con un evento que capture el click.
    template.querySelector(".btn-info").dataset.id = unProducto.id;
    // Capturar dentro del template, el elemento que contiene la clase "btn-danger", y asignarle un id con dataset(data-id="id"), para luego poder asociar el botón '-' con un evento que capture el click.
    template.querySelector(".btn-danger").dataset.id = unProducto.id;

    // Clonar el template y sus nodos hijos
    const clon = template.cloneNode(true);
    // Agregar el clon al fragment para ir almacenando la estructura (de esta forma, no se incorpora aún al DOM, para evitar reflow)
    fragment.appendChild(clon);
  });

  // Agregar el fragment al contenedor de items del carrito (incorporar estructura al DOM)
  items.appendChild(fragment);

  // Llamamos a la función para pintar el footer del carrito actualizado
  pintarFooterCarrito();
  // Llamamos a la función para asociar la acción de los botones '+' y '-' del carrito, con un evento que capture el click.
  accionBotones();
};

// Si el carrito recuperado no está vacio, pintar productos en el carrito
if (carritoRecuperado !== null) {
  // Converir el json 'carritoRecuperado' en el objeto 'carritoTemp'
  let carritoTemp = JSON.parse(carritoRecuperado);
  // Asignar una copia de 'carritoTemp' al objeto 'carrito'
  carrito = carritoTemp;
  pintarProductosEnCarrito();
}
