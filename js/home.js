
document.addEventListener("DOMContentLoaded", function() {
    cargarCarrusel();
    cargarDestacados();
    cargarCategorias();
});


// CARGAR IMÁGENES DEL CARRUSEL (se agregan desde categoria.html)
function cargarCarrusel() {
    const imagenes = JSON.parse(localStorage.getItem("carrusel")) || [];

    // Si no han agregado imágenes, se dejan las que trae el index
    if (imagenes.length === 0) return;

    const carrusel = document.querySelector("#carouselExampleControls .carousel-inner");

    carrusel.innerHTML = "";

    imagenes.forEach(function(imagen, indice) {
        const item = document.createElement("div");
        item.className = "carousel-item";

        if (indice === 0) {
            item.classList.add("active");
        }

        const img = document.createElement("img");
        img.src = imagen;
        img.className = "d-block";
        img.alt = "Imagen " + (indice + 1);

        item.appendChild(img);
        carrusel.appendChild(item);
    });
}


// CARGAR PRODUCTOS DESTACADOS
function cargarDestacados() {
    const productos = JSON.parse(localStorage.getItem("productosDestacados")) || [];
    const tarjetas = document.querySelectorAll("#contenedor-destacados .producto");

    productos.forEach(function(producto, indice) {
        const tarjeta = tarjetas[indice];

        if (!tarjeta || !producto) return;

        tarjeta.querySelector("b").textContent = producto.nombre;
        tarjeta.querySelector("p").textContent = producto.descripcion;
        tarjeta.querySelector("img").src = producto.imagen;
    });
}


// CARGAR LAS CATEGORÍAS CREADAS EN EL PANEL
let todosLosProductos = [];

async function cargarCategorias() {
    const contenedor = document.getElementById("contenedor-categorias");

    try {
        const respuestaCategorias = await fetch("../php/listar_categoria.php");
        const categorias = await respuestaCategorias.json();

        const respuestaProductos = await fetch("../php/producto.php");
        todosLosProductos = await respuestaProductos.json();

        categorias.forEach(function(categoria) {
            // Buscamos un producto de esta categoría para usar su imagen
            const productoConImagen = todosLosProductos.find(function(producto) {
                return producto.id_categoria == categoria.id_categoria && producto.imagen;
            });

            const tarjeta = document.createElement("div");
            tarjeta.className = "producto";

            const imagen = document.createElement("img");
            imagen.alt = categoria.nombre_categoria;

            if (productoConImagen) {
                imagen.src = productoConImagen.imagen;
            } else {
                imagen.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80";
            }

            const enlace = document.createElement("a");
            enlace.className = "button is -link";
            enlace.href = "#seccion-productos";

            const nombre = document.createElement("h3");
            nombre.textContent = categoria.nombre_categoria;

            enlace.appendChild(nombre);

            enlace.addEventListener("click", function() {
                mostrarProductos(categoria);
            });

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(document.createElement("br"));
            tarjeta.appendChild(enlace);

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
    }
}


// MOSTRAR LOS PRODUCTOS DE UNA CATEGORÍA
function mostrarProductos(categoria) {
    const seccion = document.getElementById("seccion-productos");
    const titulo = document.getElementById("titulo-productos");
    const lista = document.getElementById("lista-productos");

    titulo.textContent = categoria.nombre_categoria.toUpperCase();
    lista.innerHTML = "";
    seccion.style.display = "block";

    const productos = todosLosProductos.filter(function(producto) {
        return producto.id_categoria == categoria.id_categoria;
    });

    if (productos.length === 0) {
        lista.textContent = "Todavía no hay productos en esta categoría.";
        return;
    }

    productos.forEach(function(producto) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto tarjeta-producto";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80";
        imagen.alt = producto.nombre_producto;

        const nombre = document.createElement("h4");
        nombre.textContent = producto.nombre_producto;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion || "";

        const precio = document.createElement("span");
        precio.className = "precio";
        precio.textContent = "$" + Number(producto.precio).toLocaleString("es-CO");

        const boton = document.createElement("button");
        boton.className = "boton";
        boton.textContent = "Agregar al carrito";

        boton.addEventListener("click", function() {
            agregarAlCarrito(
                producto.id_producto,
                producto.nombre_producto,
                producto.precio,
                imagen.src
            );
        });

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(boton);

        lista.appendChild(tarjeta);
    });
}
