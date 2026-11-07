
// =====================================================
// PRODUCTOS CREADOS EN EL ADMINISTRADOR (desde MySQL)
// Necesita medios.js y carrito.js cargados antes.
//
// Dos formas de uso:
//  1) html/productos.html?categoria=ID  -> página de una categoría nueva
//  2) <script src="../js/productos.js" data-categoria-nombre="Cupcake">
//     en las páginas fijas: agrega al final los productos de esa categoría
// =====================================================

(function () {
    const script = document.currentScript;
    const nombreFijo = script ? script.dataset.categoriaNombre : null;

    function crearTarjeta(producto) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        if (producto.imagen) {
            tarjeta.appendChild(crearMedio(producto.imagen, producto.tipo_media, {
                alt: producto.nombre_producto,
                clase: "visor-producto"
            }));
        }

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre_producto;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion || "";

        const precio = document.createElement("h4");
        precio.textContent = formatoPrecio(producto.precio);

        const boton = document.createElement("a");
        boton.className = "button is-link";
        boton.href = "#";
        boton.innerHTML = "<h3>Agregar al carrito</h3>";
        boton.addEventListener("click", function (evento) {
            evento.preventDefault();
            agregarAlCarrito(
                producto.nombre_producto,
                producto.precio,
                producto.imagen,
                producto.id_producto
            );
        });

        tarjeta.append(titulo, descripcion, precio, boton);
        return tarjeta;
    }

    async function pedirProductos(idCategoria) {
        const respuesta = await fetch("../php/listar_productos.php?categoria=" + encodeURIComponent(idCategoria));
        if (!respuesta.ok) throw new Error("No se pudieron cargar los productos");
        return respuesta.json();
    }

    // Busca la categoría de la BD cuyo nombre coincide (Cupcake = Cupcakes = cupcake)
    async function buscarCategoriaPorNombre(nombre) {
        const respuesta = await fetch("../php/listar_categoria.php");
        if (!respuesta.ok) return null;

        const categorias = await respuesta.json();
        const buscado = normalizarNombre(nombre);

        return categorias.find(c => normalizarNombre(c.nombre_categoria) === buscado) || null;
    }

    // MODO 2: páginas fijas
    async function agregarAPaginaFija() {
        const contenedor = document.querySelector(".productos");
        if (!contenedor) return;

        try {
            const categoria = await buscarCategoriaPorNombre(nombreFijo);
            if (!categoria) return;

            const datos = await pedirProductos(categoria.id_categoria);
            datos.productos.forEach(p => contenedor.appendChild(crearTarjeta(p)));
        } catch (error) {
            // Si el servidor no responde, la página fija sigue funcionando igual
            console.warn("Productos de la base de datos no disponibles:", error);
        }
    }

    // MODO 1: productos.html?categoria=ID
    async function cargarPaginaCategoria() {
        const contenedor = document.getElementById("lista-productos");
        const titulo = document.getElementById("titulo-categoria");
        const id = new URLSearchParams(window.location.search).get("categoria");

        if (!id) {
            contenedor.innerHTML = '<p class="aviso">No se indicó ninguna categoría.</p>';
            return;
        }

        try {
            const datos = await pedirProductos(id);

            if (!datos.categoria) {
                titulo.textContent = "Categoría no encontrada";
                contenedor.innerHTML = '<p class="aviso">Esta categoría ya no existe.</p>';
                return;
            }

            titulo.textContent = datos.categoria.nombre_categoria;
            document.title = datos.categoria.nombre_categoria + " - Dulce Rincón";
            contenedor.innerHTML = "";

            if (datos.productos.length === 0) {
                contenedor.innerHTML = '<p class="aviso">Muy pronto tendremos productos en esta categoría. 🧁</p>';
                return;
            }

            datos.productos.forEach(p => contenedor.appendChild(crearTarjeta(p)));
        } catch (error) {
            console.error(error);
            contenedor.innerHTML = '<p class="aviso">No se pudieron cargar los productos. Verifica tu conexión.</p>';
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (nombreFijo) {
            agregarAPaginaFija();
        } else {
            cargarPaginaCategoria();
        }
    });
})();
