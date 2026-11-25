
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

const erroresCategoria = {
    "1": "No fue posible guardar la categoría. Inténtalo nuevamente.",
    "nombre": "Escribe el nombre de la categoría.",
    "sin_imagen": "No llegó ninguna imagen. Selecciona una imagen para la categoría (si el campo no aparece, recarga la página con Ctrl + F5).",
    "formato": "El archivo no es una imagen JPG, PNG o WEBP válida. Si la descargaste de internet, puede que tenga otro formato aunque diga .jpg.",
    "tamano": "La imagen pesa demasiado. El máximo es 5 MB."
};

if (erroresCategoria[parametros.get("error")]) {
    mostrarMensaje("⚠️", "¡Ups! Algo salió mal", erroresCategoria[parametros.get("error")]);
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

            if (categoria.imagen) {
                const foto = document.createElement("img");
                foto.src = categoria.imagen;
                foto.alt = categoria.nombre_categoria;
                foto.style.cssText = "width: 60px; height: 60px; object-fit: cover; border-radius: 50%; float: right;";
                elemento.appendChild(foto);
            }

            elemento.appendChild(nombre);
            elemento.appendChild(codigo);

            lista.appendChild(elemento);
        });

    } catch (error) {
        lista.textContent = "Error al cargar las categorías. Verifica tu conexión.";
        console.error(error);
    }
}


// ADMINISTRAR HOME
// Los cambios se guardan en el navegador (localStorage) y el home (index.html)
// los lee al abrirse; si el home ya está abierto en otra pestaña, se actualiza solo.

// Imagen que tiene el home en el banner cuando todavía no se ha cambiado
const BANNER_INICIAL =
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";

// Convierte un archivo (o una imagen reducida) en texto para poder guardarlo
function archivoATexto(archivo) {
    return new Promise((resolver, rechazar) => {
        const lector = new FileReader();
        lector.onload = () => resolver(lector.result);
        lector.onerror = rechazar;
        lector.readAsDataURL(archivo);
    });
}

// Abre el selector de archivos y devuelve la imagen elegida ya reducida
function elegirImagen(ladoMaximo) {
    return new Promise(resolver => {
        const selector = document.createElement("input");
        selector.type = "file";
        selector.accept = "image/png, image/jpeg, image/webp";

        selector.addEventListener("change", async function () {
            const archivo = selector.files[0];

            if (!archivo) {
                resolver(null);
                return;
            }

            try {
                const reducida = await reducirImagen(archivo, ladoMaximo);
                resolver(await archivoATexto(reducida));
            } catch (error) {
                console.error(error);
                mostrarMensaje("⚠️", "¡Ups! Algo salió mal",
                    "No se pudo leer la imagen. Prueba con una foto JPG o PNG.");
                resolver(null);
            }
        });

        selector.click();
    });
}

// Guarda en el navegador; avisa si no hay espacio en vez de fallar en silencio
function guardarEnHome(clave, valor) {
    try {
        localStorage.setItem(clave, valor);
        return true;
    } catch (error) {
        console.error(error);
        mostrarMensaje("⚠️", "No se pudo guardar",
            "No hay espacio suficiente para guardar la imagen. Prueba con una imagen más pequeña.");
        return false;
    }
}

function mostrarBanner(imagen) {
    const banner = document.querySelector(".banner");
    if (!banner) return;

    let vista = document.getElementById("vista-banner");

    if (!vista) {
        vista = document.createElement("img");
        vista.id = "vista-banner";
        vista.alt = "Banner principal";
        vista.style.width = "180px";
        vista.style.height = "100px";
        vista.style.objectFit = "cover";
        vista.style.borderRadius = "8px";

        banner.insertBefore(vista, banner.querySelector("button"));
    }

    vista.src = imagen;
}


// EDITAR BANNER PRINCIPAL
async function editarBanner() {
    const imagen = await elegirImagen(1600);

    if (!imagen) return;

    if (guardarEnHome("bannerPrincipal", imagen)) {
        mostrarBanner(imagen);
        mostrarMensaje("🎂", "¡Banner actualizado!",
            "El nuevo banner ya aparece en el home.");
    }
}


// EDITAR PRODUCTOS DESTACADOS
async function editarProducto(boton) {
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

    let nuevaImagen = imagen.getAttribute("src");

    if (confirm("¿Deseas cambiar la imagen del producto?")) {
        const elegida = await elegirImagen(600);
        if (elegida) nuevaImagen = elegida;
    }

    const productos = JSON.parse(
        localStorage.getItem("productosDestacados")
    ) || [];

    const indice = Array.from(producto.parentElement.children).indexOf(producto);

    productos[indice] = {
        nombre: nuevoNombre.trim(),
        descripcion: nuevaDescripcion.trim(),
        imagen: nuevaImagen
    };

    if (!guardarEnHome("productosDestacados", JSON.stringify(productos))) return;

    titulo.textContent = nuevoNombre.trim();
    descripcion.textContent = nuevaDescripcion.trim();
    imagen.src = nuevaImagen;

    mostrarMensaje("🧁", "¡Producto actualizado!",
        "El producto destacado ya aparece así en el home.");
}


// MOSTRAR LOS CAMBIOS GUARDADOS
function cargarCambios() {
    const productos = JSON.parse(
        localStorage.getItem("productosDestacados")
    ) || [];

    const elementos = document.querySelectorAll(".productos .producto");

    elementos.forEach((producto, indice) => {
        if (!productos[indice]) return;

        producto.querySelector("b").textContent = productos[indice].nombre;
        producto.querySelector("p").textContent = productos[indice].descripcion;
        producto.querySelector("img").src = productos[indice].imagen;
    });

    // Siempre se muestra el banner que tiene el home en este momento
    mostrarBanner(localStorage.getItem("bannerPrincipal") || BANNER_INICIAL);
}


// VISTA PREVIA DE LA IMAGEN DE LA CATEGORÍA
function vistaPreviaCategoria() {
    const input = document.getElementById("imagenCategoria");
    const vista = document.getElementById("vistaCategoria");

    if (!input || !vista) return;

    input.addEventListener("change", function () {
        const archivo = input.files[0];

        if (!archivo) {
            vista.style.display = "none";
            return;
        }

        vista.src = URL.createObjectURL(archivo);
        vista.style.display = "block";
    });
}


// REDUCIR LA IMAGEN ANTES DE ENVIARLA
// Las fotos grandes (por ejemplo de celular) se achican a un máximo de
// 1200 px y se comprimen, para que pesen poco y la página cargue rápido.
const LADO_MAXIMO = 1200;

async function reducirImagen(archivo, ladoMaximo = LADO_MAXIMO) {
    const imagen = await createImageBitmap(archivo);

    const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height));
    const ancho = Math.round(imagen.width * escala);
    const alto = Math.round(imagen.height * escala);

    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    lienzo.getContext("2d").drawImage(imagen, 0, 0, ancho, alto);

    // WEBP conserva la transparencia de los PNG y pesa mucho menos
    const blob = await new Promise(resolver =>
        lienzo.toBlob(resolver, "image/webp", 0.85)
    );

    const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], nombre, { type: "image/webp" });
}

function prepararFormularioCategoria() {
    const formulario = document.querySelector('form[action$="categoria.php"]');
    const input = document.getElementById("imagenCategoria");

    if (!formulario || !input) return;

    formulario.addEventListener("submit", async function (evento) {
        const archivo = input.files[0];

        // Imágenes pequeñas (menos de 1 MB) se envían tal cual
        if (!archivo || archivo.size <= 1024 * 1024) return;

        evento.preventDefault();

        const boton = formulario.querySelector('button[type="submit"]');
        if (boton) {
            boton.disabled = true;
            boton.textContent = "Preparando imagen...";
        }

        try {
            const reducida = await reducirImagen(archivo);
            const lista = new DataTransfer();
            lista.items.add(reducida);
            input.files = lista.files;
        } catch (error) {
            // Si el navegador no puede leer la imagen, se envía la original
            console.error("No se pudo reducir la imagen:", error);
        }

        formulario.submit();
    });
}


// EJECUTAR FUNCIONES AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias();
    cargarCambios();
    vistaPreviaCategoria();
    prepararFormularioCategoria();
});

