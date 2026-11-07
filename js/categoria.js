
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


// CARRUSEL DEL INICIO
// Imágenes que trae el index si todavía no se ha agregado ninguna
const imagenesIniciales = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80",
    "https://www.tortasytortas.com.co/images/virtuemart/product/resized/miloj%C3%B3n%20fresa-maracuy%C3%A1%20web_640x200.jpg"
];

function obtenerCarrusel() {
    return JSON.parse(localStorage.getItem("carrusel")) || imagenesIniciales;
}

function guardarCarrusel(imagenes) {
    try {
        localStorage.setItem("carrusel", JSON.stringify(imagenes));
        return true;
    } catch (error) {
        alert("La imagen es muy pesada. Intenta con una imagen más pequeña.");
        return false;
    }
}

// Abre el selector de archivos y devuelve la imagen elegida
function elegirImagen(cuandoTermine) {
    const selector = document.createElement("input");
    selector.type = "file";
    selector.accept = "image/*";

    selector.onchange = function () {
        const archivo = selector.files[0];

        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = function (evento) {
            cuandoTermine(evento.target.result);
        };

        lector.readAsDataURL(archivo);
    };

    selector.click();
}

// Muestra las imágenes del carrusel en el panel
function mostrarCarrusel() {
    const lista = document.getElementById("lista-carrusel");

    if (!lista) return;

    lista.innerHTML = "";

    obtenerCarrusel().forEach(function (imagen, indice) {
        const elemento = document.createElement("div");
        elemento.className = "producto imagen-carrusel";

        elemento.innerHTML = `
            <img src="${imagen}" alt="Imagen del carrusel">
            <div><b>Imagen ${indice + 1}</b></div>
            <button type="button" onclick="cambiarImagenCarrusel(${indice})">Cambiar</button>
            <button type="button" onclick="eliminarImagenCarrusel(${indice})">Eliminar</button>
        `;

        lista.appendChild(elemento);
    });
}

function agregarImagenCarrusel() {
    elegirImagen(function (imagen) {
        const imagenes = obtenerCarrusel();
        imagenes.push(imagen);

        if (guardarCarrusel(imagenes)) {
            mostrarCarrusel();
            alert("¡Imagen agregada al carrusel!");
        }
    });
}

function cambiarImagenCarrusel(indice) {
    elegirImagen(function (imagen) {
        const imagenes = obtenerCarrusel();
        imagenes[indice] = imagen;

        if (guardarCarrusel(imagenes)) {
            mostrarCarrusel();
            alert("¡Imagen cambiada!");
        }
    });
}

function eliminarImagenCarrusel(indice) {
    const imagenes = obtenerCarrusel();

    if (imagenes.length === 1) {
        alert("El carrusel debe tener al menos una imagen.");
        return;
    }

    if (!confirm("¿Seguro que quieres eliminar esta imagen?")) return;

    imagenes.splice(indice, 1);
    guardarCarrusel(imagenes);
    mostrarCarrusel();
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

        try {
            localStorage.setItem("productosDestacados", JSON.stringify(productos));
        } catch (error) {
            alert("La imagen es muy pesada. Intenta con una imagen más pequeña.");
            return;
        }

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

    const elementos = document.querySelectorAll(".producto:not(.imagen-carrusel)");

    elementos.forEach((producto, indice) => {
        if (!productos[indice]) return;

        producto.querySelector("b").textContent = productos[indice].nombre;
        producto.querySelector("p").textContent = productos[indice].descripcion;
        producto.querySelector("img").src = productos[indice].imagen;
    });

    mostrarCarrusel();
}


// EJECUTAR FUNCIONES AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias();
    cargarCambios();
});

