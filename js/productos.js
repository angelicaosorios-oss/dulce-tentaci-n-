// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
// Cada página tiene un <template data-categoria="..."> con el diseño de la tarjeta.
// Por cada producto de esa categoría se copia la plantilla y se rellenan los
// elementos marcados con data-campo="modelo | nombre | descripcion | precio | agregar".
// data-titulo="sabor" en la plantilla muestra el sabor en vez del nombre completo.

function formatoPrecioProducto(numero) {
    return "$" + Number(numero).toLocaleString("es-CO");
}

function crearTarjeta(plantilla, producto) {
    const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
    const campo = nombre => tarjeta.querySelector('[data-campo="' + nombre + '"]');

    const titulo = plantilla.dataset.titulo === "sabor" && producto.sabor
        ? producto.sabor
        : producto.nombre_producto;

    // Modelo 3D (.glb) o, si el producto se creó con una foto, una imagen normal
    const visor = campo("modelo");

    if (visor && producto.imagen) {
        if (producto.imagen.toLowerCase().endsWith(".glb")) {
            visor.setAttribute("src", producto.imagen);
            visor.setAttribute("alt", producto.nombre_producto);
        } else {
            const foto = document.createElement("img");
            foto.className = visor.className;
            foto.src = producto.imagen;
            foto.alt = producto.nombre_producto;
            visor.replaceWith(foto);
        }
    }

    if (campo("nombre")) campo("nombre").textContent = titulo;
    if (campo("descripcion")) campo("descripcion").textContent = producto.descripcion || "";
    if (campo("precio")) campo("precio").textContent = formatoPrecioProducto(producto.precio);

    const boton = campo("agregar");

    if (boton) {
        boton.addEventListener("click", function (evento) {
            evento.preventDefault();
            agregarAlCarrito(
                producto.nombre_producto,
                producto.precio,
                producto.imagen,
                producto.id_producto
            );
        });
    }

    return tarjeta;
}

async function cargarProductos(plantilla) {
    const contenedor = plantilla.parentElement;
    const categoria = plantilla.dataset.categoria;

    try {
        const respuesta = await fetch(
            "../php/listar_productos.php?categoria=" + encodeURIComponent(categoria)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        const productos = await respuesta.json();

        if (productos.length === 0) {
            const aviso = document.createElement("p");
            aviso.textContent = "Todavía no hay productos en esta categoría.";
            contenedor.appendChild(aviso);
            return;
        }

        productos.forEach(producto => {
            contenedor.insertBefore(crearTarjeta(plantilla, producto), plantilla);
        });

    } catch (error) {
        const aviso = document.createElement("p");
        aviso.textContent = "Error al cargar los productos. Verifica tu conexión.";
        contenedor.appendChild(aviso);
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("template[data-categoria]").forEach(cargarProductos);
});
