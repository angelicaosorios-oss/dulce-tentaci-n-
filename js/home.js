
// =====================================================
// PÁGINA PRINCIPAL (index.html)
// Carga desde MySQL: carrusel, productos destacados y categorías nuevas.
// Necesita medios.js cargado antes.
// =====================================================

// Categorías que ya tienen su propia página fija
const PAGINAS_FIJAS = {
    malteada: "malteada.html",
    cupcake: "cupcake.html",
    galleta: "galletas.html",
    cheesecake: "Cheesecakes.html",
    helado: "helados.html"
};

// ---------- CARRUSEL ----------
function pintarCarrusel(diapositivas) {
    const contenedor = document.getElementById("carrusel-inner");

    // Si no hay datos, se quedan las imágenes que ya trae el HTML
    if (!contenedor || diapositivas.length === 0) return;

    contenedor.innerHTML = "";

    diapositivas.forEach(function (diapositiva, indice) {
        const item = document.createElement("div");
        item.className = "carousel-item" + (indice === 0 ? " active" : "");

        item.appendChild(crearMedio(diapositiva.archivo, diapositiva.tipo_media, {
            alt: diapositiva.texto_alt || diapositiva.titulo,
            autoRotar: Number(diapositiva.auto_rotar),
            clase: "d-block"
        }));

        if (diapositiva.titulo || diapositiva.descripcion) {
            const texto = document.createElement("div");
            texto.className = "carousel-caption";

            const titulo = document.createElement("h5");
            titulo.textContent = diapositiva.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = diapositiva.descripcion;

            texto.append(titulo, descripcion);
            item.appendChild(texto);
        }

        contenedor.appendChild(item);
    });

    // Ocultar flechas si solo hay una diapositiva
    const carrusel = document.getElementById("carouselExampleControls");
    carrusel.querySelectorAll(".carousel-control-prev, .carousel-control-next")
        .forEach(boton => boton.style.display = diapositivas.length > 1 ? "" : "none");
}

// ---------- PRODUCTOS DESTACADOS ----------
function pintarDestacados(destacados) {
    const contenedor = document.getElementById("contenedor-destacados");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    destacados.forEach(function (destacado) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto";

        tarjeta.appendChild(crearMedio(destacado.archivo, destacado.tipo_media, {
            alt: destacado.texto_alt || destacado.titulo,
            autoRotar: Number(destacado.auto_rotar)
        }));

        const texto = document.createElement("div");

        const titulo = document.createElement("b");
        titulo.textContent = destacado.titulo;

        const descripcion = document.createElement("p");
        descripcion.textContent = destacado.descripcion;

        texto.append(titulo, descripcion);
        tarjeta.appendChild(texto);
        contenedor.appendChild(tarjeta);
    });

    // Si la tabla aún no existe, ocultar la sección para no dejarla vacía
    contenedor.closest(".destacados").style.display = destacados.length ? "" : "none";
}

// ---------- CATEGORÍAS NUEVAS ----------
function pintarCategorias(categorias) {
    const contenedor = document.getElementById("contenedor-categorias");
    if (!contenedor) return;

    contenedor.querySelectorAll(".categoria-nueva").forEach(el => el.remove());

    categorias.forEach(function (categoria) {
        // Si ya tiene página fija (ej. "Cupcakes"), no se repite la tarjeta
        if (PAGINAS_FIJAS[normalizarNombre(categoria.nombre_categoria)]) return;

        const tarjeta = document.createElement("div");
        tarjeta.className = "producto categoria-nueva";

        if (categoria.imagen) {
            tarjeta.appendChild(crearMedio(categoria.imagen, categoria.tipo_media, {
                alt: categoria.nombre_categoria,
                controles: false
            }));
        } else {
            const vacio = document.createElement("div");
            vacio.className = "sin-imagen";
            vacio.textContent = "🧁";
            tarjeta.appendChild(vacio);
        }

        const enlace = document.createElement("a");
        enlace.className = "button is-link";
        enlace.href = "../html/productos.html?categoria=" + encodeURIComponent(categoria.id_categoria);

        const nombre = document.createElement("h3");
        nombre.textContent = categoria.nombre_categoria;

        enlace.appendChild(nombre);
        tarjeta.appendChild(enlace);
        contenedor.appendChild(tarjeta);
    });
}

// ---------- BARRA INFERIOR SEGÚN LA SESIÓN ----------
async function pintarOpciones() {
    const sesion = await consultarSesion();
    const barra = document.getElementById("opciones-home");
    const enlaceSesion = document.getElementById("enlace-sesion");

    if (!sesion.logueado || !barra) return;

    const admin = document.createElement("a");
    admin.href = "../html/categoria.html";
    admin.className = "categoria";
    admin.textContent = "⚙️ Administrar";
    barra.insertBefore(admin, enlaceSesion);

    enlaceSesion.href = "../php/cerrar_sesion.php";
    enlaceSesion.textContent = "↪ Cerrar sesión";
}

// ---------- INICIO ----------
document.addEventListener("DOMContentLoaded", async function () {
    pintarOpciones();

    try {
        const respuesta = await fetch("../php/home.php", { cache: "no-store" });
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const datos = await respuesta.json();

        pintarCarrusel(datos.carrusel || []);
        pintarDestacados(datos.destacados || []);
        pintarCategorias(datos.categorias || []);
    } catch (error) {
        console.warn("No se pudo cargar el contenido del home:", error);
        document.querySelector(".destacados").style.display = "none";
    }
});
