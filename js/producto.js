// Crear la clase 'Producto' (para definir tipo de datos y la estructura de cada objeto producto)
class Producto {
  constructor(id, nombre, descripcion, precio, imgUrl) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imgUrl = imgUrl;
  }
}

//Declarar el array producto (que es una colección de objetos producto), e inicializarlo vacio
let producto = [];

//Expresión del objeto 'producto#', e instanciar usando la clase 'Producto'
const producto1 = new Producto(
  1,
  "Naponesa",
  "Milanesa con tomate, jamón y queso",
  3900,
  "background-image: url(https://cdn.glitch.global/a0be5666-5787-40c2-8bf0-5be519a01a1e/milaNaponesa.jpeg?v=1669167027269);"
);
producto.push(producto1);

const producto2 = new Producto(
  2,
  "Rúcula y Crudo",
  "Milanesa con rúcula y jamón crudo",
  4300,
  "background-image: url(https://cdn.glitch.global/a0be5666-5787-40c2-8bf0-5be519a01a1e/milaJamonRucula.jpeg?v=1669166960609);"
);
producto.push(producto2);

const producto3 = new Producto(
  3,
  "Panceta y Verdeo",
  "Milanesa con panceta y verdeo",
  4500,
  "background-image: url(https://cdn.glitch.global/a0be5666-5787-40c2-8bf0-5be519a01a1e/pancetaVerdeo.jfif?v=1669165974056);"
);
producto.push(producto3);

const producto4 = new Producto(
  4,
  "Vegetariana",
  "Milanesa vegetariana",
  3700,
  "background-image: url(https://cdn.glitch.global/a0be5666-5787-40c2-8bf0-5be519a01a1e/rsz_vegetariana.jpg?v=1669167653226);"
);
producto.push(producto4);

// Capturar el contenedor de productos
const contenedorProductos = document.getElementById("contenedor-productos");
// Declarar función para pintar los productos dentro del contenedor
const pintarProductos = (producto) => {
  // MODIFICAR EL TEMPLATE DE PRODUCTOS CON LA INFORMACIÓN DE CADA PRODUCTO
  // Capturar el contenido del template de productos (Document Fragment)
  const template = document.getElementById("template-productos").content;
  //--> console.log(template)
  // Crear un fragment, y usarlo para evitar el reflow
  const fragment = document.createDocumentFragment();
  // Recorrer el array de productos y cargar el template
  producto.forEach((unProducto) => {
    //--> console.log(unProducto);

    // Capturar dentro del template, el elemento que contiene la clase 'cover', y dentro de él, al atributo 'title' asignarle la descripcion
    template
      .querySelector(".cover")
      .setAttribute("title", unProducto.descripcion);
    // Capturar dentro del template, el elemento que contiene la clase 'cover', y dentro de él, al atributo 'style' asignarle la url de la imagen
    template.querySelector(".cover").setAttribute("style", unProducto.imgUrl);
    // Capturar dentro del template, el elemento que contiene la etiqueta h5, y asignarle el nombre a su contenido
    template.querySelector("h5").textContent = unProducto.nombre;
    // Capturar dentro del template, el elemento que contiene la etiqueta span, y asignarle el precio a su contenido
    template.querySelector("span").textContent = "$" + unProducto.precio;
    // Capturar dentro del template, el elemento que contiene la etiqueta button, y asignarle un id con dataset(data-id="id"), para luego poder asociarlo con un evento que capture el click
    template.querySelector("button").dataset.id = unProducto.id;
    // Clonar el template y sus nodos hijos
    const clon = template.cloneNode(true);
    // Agregar el clon al fragment para ir almacenando la estructura (de esta forma, no se incorpora aún al DOM, para evitar reflow)
    fragment.appendChild(clon);
  });

  // Agregar el fragment al contenedor de productos (incorporar estructura al DOM)
  contenedorProductos.appendChild(fragment);
};

// Declarar función para detectar los botones 'Agregar' de las cards y asociarlos con un evento que capture el click y ejecute una funcion
const detectarBotonesAgregar = (producto) => {
  // Capturar dentro de los elementos del document que contienen la clase 'card', todos los elementos que contengan la etiqueta button, y los cargamos en el array botonesAgregar
  const botonesAgregar = document.querySelectorAll(".card button");

  // Recorrer el array de botonesAgregar
  botonesAgregar.forEach((unBotonAgregar) => {
    // Asociar el evento 'click' de cada botón a una función que agregue el producto correspondiente al carrito
    unBotonAgregar.addEventListener("click", () => {
      //--> console.log(unBotonAgregar.dataset.id); //(unBotonAgregar.dataset.id) es un string

      // Detectar el producto. Buscar dentro del array producto, el item cuyo id coincide con el id del botón clickeado, y devolverlo en 'unProducto'
      const unProducto = producto.find(
        (item) => item.id === parseInt(unBotonAgregar.dataset.id)
      );
      // Agrego el atributo 'cantidad' a 'unProducto'. Por defecto es igual a 1
      unProducto.cantidad = 1;
      // Si ya existe el producto en el carrito, a la cantidad previa del producto correspondiente, le sumo 1 y ese valor lo guardo en 'unProducto'
      if (carrito.hasOwnProperty(unProducto.id)) {
        unProducto.cantidad = carrito[unProducto.id].cantidad + 1;
      }
      // Agregamos una copia de 'unProducto' (con spread operator), en el atributo 'unProducto.id' del carrito, sobreescribiendo el objeto si ya existía
      carrito[unProducto.id] = { ...unProducto };
      //--> console.log('carrito', carrito);

      // Guardar carrito en LocalStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      // Llamamos a la función para pintar productos en el carrito
      pintarProductosEnCarrito();
    });
  });
};

// Usar event listener para asegurarnos que ya se cargó completamente la página, antes de ejecutar las funciones
document.addEventListener("DOMContentLoaded", () => {
  // Pintar los productos en la página
  pintarProductos(producto);
  // Detectar los botones 'Agregar' de las cards y asociar el evento click a una función
  detectarBotonesAgregar(producto);
});
