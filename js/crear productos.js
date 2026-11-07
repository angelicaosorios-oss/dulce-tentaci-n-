
// CARGAR CATEGORÍAS DESDE MYSQL
async function cargarCategoriasProducto() {
    const select = document.getElementById("categoria");

    if (!select) return;

    select.innerHTML = '<option value="">Cargando categorías...</option>';

    try {
        const respuesta = await fetch("../php/listar_categoria.php");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las categorías");
        }

        const categorias = await respuesta.json();

        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(function(categoria) {
            const opcion = document.createElement("option");
            opcion.value = categoria.id_categoria;
            opcion.textContent = categoria.nombre_categoria;
            select.appendChild(opcion);
        });

    } catch (error) {
        console.error("Error:", error);
        select.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}


// CARGAR LA PÁGINA Y SUS FUNCIONES
document.addEventListener("DOMContentLoaded", function() {

    // Cargar categorías
    cargarCategoriasProducto();

    // ELEMENTOS DEL MENSAJE
    const mensaje = document.getElementById("mensaje");
    const iconoMensaje = document.getElementById("icono-mensaje");
    const tituloMensaje = document.getElementById("titulo-mensaje");
    const textoMensaje = document.getElementById("texto-mensaje");
    const cerrarMensaje = document.getElementById("cerrar-mensaje");

    // MOSTRAR MENSAJES
    const parametros = new URLSearchParams(window.location.search);

    function mostrarMensaje(icono, titulo, texto) {
        if (!mensaje) return;

        iconoMensaje.textContent = icono;
        tituloMensaje.textContent = titulo;
        textoMensaje.textContent = texto;

        mensaje.classList.add("mostrar");
    }

    if (parametros.get("registro") === "correcto") {
        mostrarMensaje(
            "🧁",
            "¡Producto creado!",
            "El producto se guardó correctamente en tu tienda."
        );
    }

    if (parametros.get("error") === "1") {
        mostrarMensaje(
            "⚠️",
            "¡Ups! Algo salió mal",
            "No fue posible guardar el producto. Verifica los datos e inténtalo nuevamente."
        );
    }

    if (cerrarMensaje) {
        cerrarMensaje.addEventListener("click", function() {
            mensaje.classList.remove("mostrar");

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        });
    }


    // VISTA PREVIA DE LA IMAGEN
    const inputImagen = document.getElementById("imagen");
    const vistaPrevia = document.getElementById("vistaPrevia");

    if (inputImagen && vistaPrevia) {
        inputImagen.addEventListener("change", function() {
            const archivo = inputImagen.files[0];

            if (!archivo) {
                vistaPrevia.style.display = "none";
                return;
            }

            vistaPrevia.src = URL.createObjectURL(archivo);
            vistaPrevia.style.display = "block";
        });
    }

});
