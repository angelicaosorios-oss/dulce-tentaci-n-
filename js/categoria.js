
// MENSAJES
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
    cerrarMensaje.addEventListener("click", function () {
        mensaje.classList.remove("mostrar");
    });
}

if (parametros.get("registro") === "correcto") {
    mostrarMensaje("🎂", "¡Categoría guardada!", "La categoría se guardó correctamente.");
}

if (parametros.get("error") === "1") {
    mostrarMensaje("⚠️", "¡Ups! Algo salió mal", "No fue posible guardar la categoría. Inténtalo nuevamente.");
}


// CARGAR CATEGORÍAS DESDE LA BASE DE DATOS
async function cargarCategorias() {
    const lista = document.getElementById("lista-categorias");

    if (!lista) return;

    try {
        const respuesta = await fetch("../php/listar_categoria.php");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las categorías");
        }

        const categorias = await respuesta.json();

        lista.innerHTML = "";

        if (categorias.length === 0) {
            lista.textContent = "Todavía no hay categorías registradas.";
            return;
        }

        categorias.forEach(categoria => {
            const elemento = document.createElement("div");
            elemento.className = "categoria-registrada";

            const nombre = document.createElement("h3");
            nombre.textContent = categoria.nombre_categoria;

            const codigo = document.createElement("small");
            codigo.textContent = "Código: " + categoria.id_categoria;

            elemento.appendChild(nombre);
            elemento.appendChild(codigo);

            lista.appendChild(elemento);
        });

    } catch (error) {
        lista.textContent = "Error al cargar las categorías. Verifica tu conexión.";
        console.error(error);
    }
}


// EDITAR BANNER PRINCIPAL
function editarBanner() {
    const selector = document.createElement("input");

    selector.type = "file";
    selector.accept = "image/*";

    selector.onchange = function () {
        const archivo = selector.files[0];

        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = function (evento) {
            const imagen = evento.target.result;

            localStorage.setItem("bannerPrincipal", imagen);

            let vista = document.getElementById("vista-banner");

            if (!vista) {
                vista = document.createElement("img");
                vista.id = "vista-banner";
                vista.style.width = "180px";
                vista.style.height = "100px";
                vista.style.objectFit = "cover";

                document.querySelector(".banner").appendChild(vista);
            }

            vista.src = imagen;

            alert("¡Banner actualizado correctamente!");
        };

        lector.readAsDataURL(archivo);
    };

    selector.click();
}


// EDITAR PRODUCTOS DESTACADOS

function editarProducto(boton) {
    const producto = boton.closest(".producto");

    const titulo = producto.querySelector("b");
    const descripcion = producto.querySelector("p");
    const imagen = producto.querySelector("img");

    const nuevoNombre = prompt("Escribe el nuevo nombre:", titulo.textContent);

    if (nuevoNombre === null || nuevoNombre.trim() === "") return;

    const nuevaDescripcion = prompt(
        "Escribe la nueva descripción:",
        descripcion.textContent
    );

    if (nuevaDescripcion === null) return;

    const selector = document.createElement("input");
    selector.type = "file";
    selector.accept = "image/*";

    selector.style.display = "none";
    document.body.appendChild(selector);

    selector.addEventListener("change", function () {
        const archivo = selector.files[0];

        if (!archivo) {
            selector.remove();
            return;
        }

        const lector = new FileReader();

        lector.onload = function (evento) {
            guardarProducto(evento.target.result);
            selector.remove();
        };

        lector.readAsDataURL(archivo);
    });

    function guardarProducto(nuevaImagen) {
        const productos = JSON.parse(
            localStorage.getItem("productosDestacados")
        ) || [];

        const indice = Array.from(producto.parentElement.children).indexOf(producto);

        productos[indice] = {
            nombre: nuevoNombre.trim(),
            descripcion: nuevaDescripcion.trim(),
            imagen: nuevaImagen
        };

        localStorage.setItem("productosDestacados", JSON.stringify(productos));

        titulo.textContent = nuevoNombre.trim();
        descripcion.textContent = nuevaDescripcion.trim();
        imagen.src = nuevaImagen;

        alert("¡Producto actualizado correctamente!");
    }

    if (confirm("¿Deseas cambiar la imagen del producto?")) {
        selector.click();
    } else {
        guardarProducto(imagen.src);
        selector.remove();
    }
}



// MOSTRAR LOS CAMBIOS GUARDADOS
function cargarCambios() {
    const productos = JSON.parse(
        localStorage.getItem("productosDestacados")
    ) || [];

    const elementos = document.querySelectorAll(".producto");

    elementos.forEach((producto, indice) => {
        if (!productos[indice]) return;

        producto.querySelector("b").textContent = productos[indice].nombre;
        producto.querySelector("p").textContent = productos[indice].descripcion;
        producto.querySelector("img").src = productos[indice].imagen;
    });

    const bannerGuardado = localStorage.getItem("bannerPrincipal");

    if (bannerGuardado) {
        let vista = document.getElementById("vista-banner");

        if (!vista && document.querySelector(".banner")) {
            vista = document.createElement("img");
            vista.id = "vista-banner";
            vista.style.width = "180px";
            vista.style.height = "100px";
            vista.style.objectFit = "cover";

            document.querySelector(".banner").appendChild(vista);
        }

        if (vista) {
            vista.src = bannerGuardado;
        }
    }
}


// EJECUTAR FUNCIONES AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias();
    cargarCambios();
});

