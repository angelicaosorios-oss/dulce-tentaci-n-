
// Necesita medios.js cargado antes.

// CARGAR CATEGORÍAS DESDE MYSQL
async function cargarCategoriasProducto() {
    const select = document.getElementById("categoria");

    if (!select) return;

    select.innerHTML = '<option value="">Cargando categorías...</option>';

    try {
        const respuesta = await fetch("../php/listar_categoria.php", { cache: "no-store" });

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las categorías");
        }

        const categorias = await respuesta.json();

        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(function (categoria) {
            const opcion = document.createElement("option");
            opcion.value = categoria.id_categoria;
            opcion.textContent = categoria.nombre_categoria;
            select.appendChild(opcion);
        });

        if (categorias.length === 0) {
            select.innerHTML = '<option value="">Primero crea una categoría</option>';
        }

    } catch (error) {
        console.error("Error:", error);
        select.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}


document.addEventListener("DOMContentLoaded", function () {

    protegerPaginaAdmin();
    cargarCategoriasProducto();

    // ELEMENTOS DEL MENSAJE
    const mensaje = document.getElementById("mensaje");
    const iconoMensaje = document.getElementById("icono-mensaje");
    const tituloMensaje = document.getElementById("titulo-mensaje");
    const textoMensaje = document.getElementById("texto-mensaje");
    const cerrarMensaje = document.getElementById("cerrar-mensaje");

    const parametros = new URLSearchParams(window.location.search);

    function mostrarMensaje(icono, titulo, texto) {
        if (!mensaje) return;

        iconoMensaje.textContent = icono;
        tituloMensaje.textContent = titulo;
        textoMensaje.textContent = texto;

        mensaje.classList.add("mostrar");
    }

    if (parametros.get("registro") === "correcto") {
        mostrarMensaje("🧁", "¡Producto creado!", "El producto se guardó correctamente en tu tienda.");
    }

    if (parametros.get("error") === "1") {
        mostrarMensaje("⚠️", "¡Ups! Algo salió mal",
            "No fue posible guardar el producto. Verifica los datos e inténtalo nuevamente.");
    }

    if (parametros.get("error") === "archivo") {
        mostrarMensaje("⚠️", "Problema con el archivo",
            parametros.get("detalle") || "El archivo no es válido.");
    }

    if (cerrarMensaje) {
        cerrarMensaje.addEventListener("click", function () {
            mensaje.classList.remove("mostrar");
            window.history.replaceState({}, document.title, window.location.pathname);
        });
    }

    // VISTA PREVIA: RECONOCE SI ES IMAGEN O MODELO 3D
    const inputArchivo = document.getElementById("imagen");
    const vistaPrevia = document.getElementById("vistaPrevia");
    const tipoDetectado = document.getElementById("tipoDetectado");
    const formulario = document.getElementById("formProducto");

    inputArchivo.addEventListener("change", function () {
        const archivo = inputArchivo.files[0];
        vistaPrevia.innerHTML = "";
        tipoDetectado.textContent = "";
        tipoDetectado.classList.remove("error");

        if (!archivo) return;

        const tipo = detectarTipoArchivo(archivo);

        if (!tipo) {
            tipoDetectado.textContent = "⚠️ Formato no permitido. Usa una imagen o un modelo .glb";
            tipoDetectado.classList.add("error");
            return;
        }

        const tamano = (archivo.size / (1024 * 1024)).toFixed(1) + " MB";
        tipoDetectado.textContent = (tipo === "modelo" ? "🧊 Modelo 3D reconocido" : "🖼️ Imagen reconocida")
            + " · " + tamano;

        vistaPrevia.appendChild(crearMedio(URL.createObjectURL(archivo), tipo, { alt: "Vista previa" }));
    });

    formulario.addEventListener("submit", function (evento) {
        const archivo = inputArchivo.files[0];

        if (archivo && !detectarTipoArchivo(archivo)) {
            evento.preventDefault();
            mostrarMensaje("⚠️", "Archivo no válido", "Usa una imagen (JPG, PNG, WEBP, GIF) o un modelo 3D .glb.");
        }
    });
});
