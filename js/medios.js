
// =====================================================
// FUNCIONES COMPARTIDAS PARA IMÁGENES Y MODELOS 3D
// Se usa en index, administrador, carrito y páginas de productos.
// =====================================================

const EXTENSIONES_IMAGEN = ["jpg", "jpeg", "png", "webp", "gif"];

// Reconoce el tipo a partir de un archivo elegido en un <input type="file">
// Devuelve "imagen", "modelo" o null.
function detectarTipoArchivo(archivo) {
    if (!archivo) return null;

    const extension = archivo.name.split(".").pop().toLowerCase();

    if (archivo.type.startsWith("image/") || EXTENSIONES_IMAGEN.includes(extension)) {
        return "imagen";
    }

    if (extension === "glb") {
        return "modelo";
    }

    return null;
}

// Reconoce el tipo a partir de una ruta ya guardada (ej: "../modelos3d/x.glb")
function detectarTipoRuta(ruta) {
    if (!ruta) return null;

    const limpia = String(ruta).split("?")[0].toLowerCase();

    return limpia.endsWith(".glb") || limpia.endsWith(".gltf") ? "modelo" : "imagen";
}

/**
 * Crea el elemento correcto para mostrar el archivo:
 *  - <model-viewer> si es un modelo 3D
 *  - <img> si es una imagen
 * opciones: { alt, autoRotar, clase, controles }
 */
function crearMedio(ruta, tipo, opciones = {}) {
    const tipoFinal = tipo || detectarTipoRuta(ruta);
    const alt = opciones.alt || "";
    let elemento;

    if (tipoFinal === "modelo") {
        elemento = document.createElement("model-viewer");
        elemento.setAttribute("src", ruta);
        elemento.setAttribute("alt", alt || "Modelo 3D");
        elemento.setAttribute("shadow-intensity", "1");
        elemento.setAttribute("rotation-per-second", "60deg");

        if (opciones.controles !== false) {
            elemento.setAttribute("camera-controls", "");
        }

        if (opciones.autoRotar !== false && opciones.autoRotar !== 0 && opciones.autoRotar !== "0") {
            elemento.setAttribute("auto-rotate", "");
        }
    } else {
        elemento = document.createElement("img");
        elemento.src = ruta;
        elemento.alt = alt;
        elemento.loading = "lazy";
    }

    if (opciones.clase) {
        elemento.className = opciones.clase;
    }

    return elemento;
}

// Evita que un texto escrito por el usuario se interprete como HTML
function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
}

function formatoPrecio(numero) {
    return "$" + Number(numero).toLocaleString("es-CO");
}

// Quita tildes, mayúsculas y la "s" final: "Galletas" -> "galleta"
function normalizarNombre(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/s$/, "");
}

// Consulta si hay sesión iniciada
async function consultarSesion() {
    try {
        const respuesta = await fetch("../php/sesion.php", { cache: "no-store" });
        return await respuesta.json();
    } catch (error) {
        return { logueado: false };
    }
}

// Para las páginas del administrador: si no hay sesión, ir al login
async function protegerPaginaAdmin() {
    const sesion = await consultarSesion();

    if (!sesion.logueado) {
        window.location.href = "inicio.html?error=sesion";
    }

    return sesion;
}
