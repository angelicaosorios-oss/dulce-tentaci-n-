
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

if (cerrarMensaje) {
    cerrarMensaje.addEventListener("click", function() {
        mensaje.classList.remove("mostrar");

        if (parametros.get("registro") === "correcto") {
            window.location.href = "categoria.html";
        }
    });
}

if (parametros.get("registro") === "correcto") {
    mostrarMensaje("🎂", "¡Categoría guardada!", "La categoría se guardó correctamente.");
}

if (parametros.get("error") === "1") {
    mostrarMensaje("⚠️", "¡Ups! Algo salió mal", "No fue posible guardar la categoría. Inténtalo nuevamente.");
}


// MOSTRAR CATEGORÍAS DE MYSQL
async function cargarCategorias() {

    const lista = document.getElementById("lista-categorias");

    if (!lista) return;

    try {
        const respuesta = await fetch("../php/listar_categoria.php");

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar las categorías");
        }

        const categorias = await respuesta.json();

        lista.innerHTML = "";

        if (categorias.length === 0) {
            lista.textContent = "Todavía no hay categorías registradas.";
            return;
        }

        categorias.forEach(function(categoria) {

            const elemento = document.createElement("div");
            elemento.className = "categoria-registrada";

            const nombre = document.createElement("h3");
            nombre.textContent = categoria.nombre_categoria;

            const identificador = document.createElement("small");
            identificador.textContent = "Código: " + categoria.id_categoria;

            elemento.appendChild(nombre);
            elemento.appendChild(identificador);

            lista.appendChild(elemento);
        });

    } catch (error) {
        lista.textContent = "Error al cargar las categorías. Verifica tu conexión.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", cargarCategorias);
