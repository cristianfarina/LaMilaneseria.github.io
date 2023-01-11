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

//Declarar función para hacer un mapeo de 'data' en un tipo de objeto 'producto'
const obtenerProductos = (data) => {
  data.forEach((unDato) => {
    let unProducto = new Producto(
      unDato.id,
      unDato.nombre,
      unDato.descripcion,
      unDato.precio,
      unDato.imgUrl
    );
    producto.push(unProducto);
  });
  //--> console.log(producto);
};

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

// Declarar función para detectar los botones 'Agregar' de las cardProduct y asociarlos con un evento que capture el click y ejecute una funcion
const detectarBotonesAgregar = (producto) => {
  // Capturar dentro de los elementos del document que contienen la clase 'cardProduct', todos los elementos que contengan la etiqueta button, y los cargamos en el array botonesAgregar
  const botonesAgregar = document.querySelectorAll(".cardProduct button");

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
  fetchData();
});

const fetchData = async () => {
  try {
    const respuesta = await fetch("./api/data.json");
    const data = await respuesta.json();
    //--> console.log(data);
    //Hacer un mapeo de 'data', usando la clase 'Producto'
    obtenerProductos(data);
    // Pintar los productos en la página
    pintarProductos(producto);
    // Detectar los botones 'Agregar' de las cardProduct y asociar el evento click a una función
    detectarBotonesAgregar(producto);
  } catch (error) {
    console.log(error);
  }
};

// AGREGAR FINALIZAR COMPRA
