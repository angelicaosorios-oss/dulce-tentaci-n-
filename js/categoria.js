
// =====================================================
// ADMINISTRADOR: CATEGORÍAS + CARRUSEL + PRODUCTOS DESTACADOS
// Todo se guarda en MySQL, así se ve en el index desde cualquier navegador.
// Necesita medios.js cargado antes.
// =====================================================

// ---------- MENSAJES ----------
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(icono, titulo, texto) {
    document.getElementById("icono-mensaje").textContent = icono;
    document.getElementById("titulo-mensaje").textContent = titulo;
    document.getElementById("texto-mensaje").textContent = texto;
    mensaje.classList.add("mostrar");
}

document.getElementById("cerrar-mensaje").addEventListener("click", function () {
    mensaje.classList.remove("mostrar");
});

// Envía un formulario a PHP y devuelve la respuesta JSON
async function enviar(url, datos) {
    const respuesta = await fetch(url, { method: "POST", body: datos });

    let resultado;
    try {
        resultado = await respuesta.json();
    } catch (error) {
        throw new Error("El servidor respondió con un error. Revisa que XAMPP esté encendido.");
    }

    if (respuesta.status === 401) {
        window.location.href = "inicio.html?error=sesion";
    }

    if (!resultado.success) {
        throw new Error(resultado.message || "No se pudo guardar.");
    }

    return resultado;
}

// ---------- VISTA PREVIA + RECONOCER TIPO ----------
// Muestra el archivo elegido y dice si es imagen o modelo 3D.
function mostrarVistaPrevia(archivo, contenedor, etiqueta) {
    contenedor.innerHTML = "";
    etiqueta.textContent = "";
    etiqueta.classList.remove("error");

    if (!archivo) return null;

    const tipo = detectarTipoArchivo(archivo);
    const tamano = (archivo.size / (1024 * 1024)).toFixed(1) + " MB";

    if (!tipo) {
        etiqueta.textContent = "⚠️ Formato no permitido. Usa JPG, PNG, WEBP, GIF o un modelo .glb";
        etiqueta.classList.add("error");
        return null;
    }

    etiqueta.textContent = (tipo === "modelo" ? "🧊 Modelo 3D reconocido" : "🖼️ Imagen reconocida")
        + " · " + tamano;

    contenedor.appendChild(crearMedio(URL.createObjectURL(archivo), tipo, { alt: "Vista previa" }));
    return tipo;
}

function mostrarRutaGuardada(ruta, tipo, contenedor, autoRotar) {
    contenedor.innerHTML = "";
    if (ruta) {
        contenedor.appendChild(crearMedio(ruta, tipo, { alt: "Actual", autoRotar: autoRotar }));
    }
}

// =====================================================
// CATEGORÍAS
// =====================================================
const formCategoria = document.getElementById("form-categoria");
const archivoCategoria = document.getElementById("archivoCategoria");
const vistaCategoria = document.getElementById("vista-categoria");
const tipoCategoria = document.getElementById("tipo-categoria");

archivoCategoria.addEventListener("change", function () {
    mostrarVistaPrevia(archivoCategoria.files[0], vistaCategoria, tipoCategoria);
});

formCategoria.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const archivo = archivoCategoria.files[0];

    if (archivo && !detectarTipoArchivo(archivo)) {
        mostrarMensaje("⚠️", "Archivo no válido", "Usa una imagen (JPG, PNG, WEBP, GIF) o un modelo 3D .glb.");
        return;
    }

    const boton = formCategoria.querySelector("button[type=submit]");
    boton.disabled = true;

    try {
        const datos = new FormData(formCategoria);
        datos.append("accion", "crear");

        const resultado = await enviar("../php/categoria.php", datos);

        formCategoria.reset();
        vistaCategoria.innerHTML = "";
        tipoCategoria.textContent = "";

        mostrarMensaje("🎂", "¡Categoría guardada!", resultado.message);
        cargarCategorias();
    } catch (error) {
        mostrarMensaje("⚠️", "¡Ups! Algo salió mal", error.message);
    } finally {
        boton.disabled = false;
    }
});

async function cargarCategorias() {
    const lista = document.getElementById("lista-categorias");

    try {
        const respuesta = await fetch("../php/listar_categoria.php", { cache: "no-store" });
        if (!respuesta.ok) throw new Error("No se pudieron cargar las categorías");

        const categorias = await respuesta.json();
        lista.innerHTML = "";

        if (categorias.length === 0) {
            lista.textContent = "Todavía no hay categorías registradas.";
            return;
        }

        categorias.forEach(function (categoria) {
            const elemento = document.createElement("div");
            elemento.className = "categoria-registrada";

            if (categoria.imagen) {
                elemento.appendChild(crearMedio(categoria.imagen, categoria.tipo_media, {
                    alt: categoria.nombre_categoria,
                    controles: false
                }));
            }

            const texto = document.createElement("div");
            texto.className = "texto";

            const nombre = document.createElement("h3");
            nombre.textContent = categoria.nombre_categoria;

            const detalle = document.createElement("small");
            detalle.textContent = "Código: " + categoria.id_categoria
                + " · " + categoria.total_productos + " producto(s)";

            texto.append(nombre, detalle);

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "eliminar";
            eliminar.textContent = "Eliminar";
            eliminar.addEventListener("click", () => eliminarCategoria(categoria));

            elemento.append(texto, eliminar);
            lista.appendChild(elemento);
        });
    } catch (error) {
        lista.textContent = "Error al cargar las categorías. Verifica tu conexión.";
        console.error(error);
    }
}

async function eliminarCategoria(categoria) {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre_categoria}"?`)) return;

    try {
        const datos = new FormData();
        datos.append("accion", "eliminar");
        datos.append("id_categoria", categoria.id_categoria);

        await enviar("../php/categoria.php", datos);
        cargarCategorias();
    } catch (error) {
        mostrarMensaje("⚠️", "No se pudo eliminar", error.message);
    }
}

// =====================================================
// FORMULARIO DEL HOME (carrusel y destacados)
// =====================================================
const modal = document.getElementById("modal-medio");
const formMedio = document.getElementById("form-medio");
const campoArchivo = document.getElementById("campo-archivo");
const vistaMedio = document.getElementById("vista-medio");
const tipoDetectado = document.getElementById("tipo-detectado");
const radiosTipo = formMedio.querySelectorAll("input[name=tipo]");

// Estado del formulario abierto
let edicion = null; // { destino: "destacado"|"carrusel", actual: {...}|null }

const ACEPTA = {
    imagen: "image/png,image/jpeg,image/webp,image/gif",
    modelo: ".glb"
};

function tipoElegido() {
    return formMedio.querySelector("input[name=tipo]:checked").value;
}

// Muestra solo los campos que corresponden al tipo elegido
function actualizarCamposSegunTipo() {
    const tipo = tipoElegido();

    campoArchivo.accept = ACEPTA[tipo];
    formMedio.classList.toggle("es-modelo", tipo === "modelo");

    document.getElementById("etiqueta-alt").textContent = tipo === "modelo"
        ? "Descripción del modelo 3D (accesibilidad)"
        : "Texto alternativo de la imagen";
}

radiosTipo.forEach(radio => radio.addEventListener("change", function () {
    // Si el archivo elegido no coincide con el tipo, se limpia
    const archivo = campoArchivo.files[0];
    if (archivo && detectarTipoArchivo(archivo) !== tipoElegido()) {
        campoArchivo.value = "";
        tipoDetectado.textContent = "";
        if (edicion.actual) {
            mostrarRutaGuardada(edicion.actual.archivo, edicion.actual.tipo_media, vistaMedio);
        } else {
            vistaMedio.innerHTML = "";
        }
    }
    actualizarCamposSegunTipo();
}));

// Al elegir un archivo se reconoce su tipo y se marca la opción correcta
campoArchivo.addEventListener("change", function () {
    const tipo = mostrarVistaPrevia(campoArchivo.files[0], vistaMedio, tipoDetectado);

    if (tipo) {
        formMedio.querySelector(`input[name=tipo][value=${tipo}]`).checked = true;
        actualizarCamposSegunTipo();
    }
});

// actual: datos guardados (null si es nuevo). posicion: 1-3 para destacados.
function abrirFormulario(destino, actual, posicion) {
    edicion = { destino, actual };
    formMedio.reset();
    tipoDetectado.textContent = "";

    const esCarrusel = destino === "carrusel";
    formMedio.classList.toggle("es-carrusel", esCarrusel);

    document.getElementById("modal-titulo").textContent = esCarrusel
        ? (actual ? "Editar diapositiva" : "Nueva diapositiva")
        : "Editar producto destacado";

    document.getElementById("etiqueta-titulo").textContent = esCarrusel
        ? "Título (opcional, aparece sobre el banner)"
        : "Nombre del producto";

    document.getElementById("campo-titulo").required = !esCarrusel;
    document.getElementById("campo-posicion").value = posicion || "";
    document.getElementById("campo-id-carrusel").value = actual && actual.id_carrusel ? actual.id_carrusel : "";

    if (actual) {
        document.getElementById("campo-titulo").value = actual.titulo || "";
        document.getElementById("campo-descripcion").value = actual.descripcion || "";
        document.getElementById("campo-alt").value = actual.texto_alt || "";
        document.getElementById("campo-auto-rotar").checked = Number(actual.auto_rotar) === 1;
        document.getElementById("campo-orden").value = actual.orden || 0;
        formMedio.querySelector(`input[name=tipo][value=${actual.tipo_media}]`).checked = true;
        mostrarRutaGuardada(actual.archivo, actual.tipo_media, vistaMedio, Number(actual.auto_rotar));
    } else {
        vistaMedio.innerHTML = "";
        document.getElementById("campo-orden").value = siguienteOrden;
    }

    actualizarCamposSegunTipo();
    modal.classList.add("mostrar");
}

function cerrarFormulario() {
    modal.classList.remove("mostrar");
    vistaMedio.innerHTML = "";
    edicion = null;
}

document.getElementById("cancelar-medio").addEventListener("click", cerrarFormulario);
modal.addEventListener("click", evento => { if (evento.target === modal) cerrarFormulario(); });
document.getElementById("agregar-diapositiva").addEventListener("click", () => abrirFormulario("carrusel", null));

formMedio.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const archivo = campoArchivo.files[0];
    const tipo = tipoElegido();

    // Validaciones según el tipo elegido
    if (archivo && detectarTipoArchivo(archivo) !== tipo) {
        mostrarMensaje("⚠️", "Archivo no válido",
            tipo === "modelo" ? "Selecciona un archivo .glb." : "Selecciona una imagen JPG, PNG, WEBP o GIF.");
        return;
    }

    if (!archivo && (!edicion.actual || edicion.actual.tipo_media !== tipo)) {
        mostrarMensaje("⚠️", "Falta el archivo",
            tipo === "modelo" ? "Selecciona el modelo 3D (.glb)." : "Selecciona la imagen.");
        return;
    }

    const boton = document.getElementById("guardar-medio");
    boton.disabled = true;
    boton.textContent = "Guardando...";

    try {
        const datos = new FormData(formMedio);
        const url = edicion.destino === "carrusel"
            ? "../php/guardar_carrusel.php"
            : "../php/guardar_destacado.php";

        if (edicion.destino === "carrusel") datos.append("accion", "guardar");

        const resultado = await enviar(url, datos);

        cerrarFormulario();
        mostrarMensaje("✅", "¡Guardado!", resultado.message + " Ya puedes verlo en el inicio.");
        cargarHome();
    } catch (error) {
        mostrarMensaje("⚠️", "¡Ups! Algo salió mal", error.message);
    } finally {
        boton.disabled = false;
        boton.textContent = "Guardar";
    }
});

// =====================================================
// LISTAS DEL HOME
// =====================================================
let siguienteOrden = 1;

function crearFila(item, titulo, subtitulo, alEditar, alEliminar) {
    const fila = document.createElement("div");
    fila.className = "producto";

    if (item.archivo) {
        fila.appendChild(crearMedio(item.archivo, item.tipo_media, {
            alt: titulo,
            controles: false,
            autoRotar: Number(item.auto_rotar)
        }));
    } else {
        const vacio = document.createElement("div");
        vacio.className = "sin-imagen";
        vacio.textContent = "🧁";
        fila.appendChild(vacio);
    }

    const texto = document.createElement("div");
    const nombre = document.createElement("b");
    nombre.textContent = titulo;
    const detalle = document.createElement("p");
    detalle.textContent = subtitulo;
    const tipo = document.createElement("span");
    tipo.className = "etiqueta-tipo";
    tipo.textContent = !item.archivo ? "Sin contenido" : item.tipo_media === "modelo" ? "Modelo 3D" : "Imagen";
    texto.append(nombre, detalle, tipo);
    fila.appendChild(texto);

    const editar = document.createElement("button");
    editar.type = "button";
    editar.textContent = "Editar";
    editar.addEventListener("click", alEditar);
    fila.appendChild(editar);

    if (alEliminar) {
        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "eliminar";
        eliminar.textContent = "Eliminar";
        eliminar.addEventListener("click", alEliminar);
        fila.appendChild(eliminar);
    }

    return fila;
}

async function eliminarDiapositiva(diapositiva) {
    if (!confirm("¿Eliminar esta diapositiva del carrusel?")) return;

    try {
        const datos = new FormData();
        datos.append("accion", "eliminar");
        datos.append("id_carrusel", diapositiva.id_carrusel);

        await enviar("../php/guardar_carrusel.php", datos);
        cargarHome();
    } catch (error) {
        mostrarMensaje("⚠️", "No se pudo eliminar", error.message);
    }
}

async function cargarHome() {
    const listaCarrusel = document.getElementById("lista-carrusel");
    const listaDestacados = document.getElementById("lista-destacados");

    try {
        const respuesta = await fetch("../php/home.php", { cache: "no-store" });
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const datos = await respuesta.json();

        listaCarrusel.innerHTML = "";
        datos.carrusel.forEach(function (diapositiva, indice) {
            listaCarrusel.appendChild(crearFila(
                diapositiva,
                diapositiva.titulo || "Diapositiva " + (indice + 1),
                diapositiva.descripcion || "Orden: " + diapositiva.orden,
                () => abrirFormulario("carrusel", diapositiva),
                () => eliminarDiapositiva(diapositiva)
            ));
        });

        siguienteOrden = datos.carrusel.reduce((max, d) => Math.max(max, Number(d.orden)), 0) + 1;

        if (datos.carrusel.length === 0) {
            listaCarrusel.textContent = "No hay diapositivas. Agrega la primera.";
        }

        listaDestacados.innerHTML = "";
        [1, 2, 3].forEach(function (posicion) {
            const destacado = datos.destacados.find(d => Number(d.posicion) === posicion)
                || { posicion, titulo: "", descripcion: "", archivo: "", tipo_media: "imagen", auto_rotar: 1 };

            listaDestacados.appendChild(crearFila(
                destacado,
                destacado.titulo || "Destacado " + posicion + " (vacío)",
                destacado.descripcion,
                () => abrirFormulario("destacado", destacado.archivo ? destacado : null, posicion)
            ));
        });
    } catch (error) {
        console.error(error);
        listaCarrusel.textContent = "No se pudo cargar. ¿Ejecutaste php/instalar.php?";
        listaDestacados.textContent = "";
    }
}

// =====================================================
// INICIO
// =====================================================
document.addEventListener("DOMContentLoaded", async function () {
    const sesion = await protegerPaginaAdmin();

    if (sesion.nombre) {
        document.getElementById("saludo").textContent = "Hola, " + sesion.nombre;
    }

    cargarCategorias();
    cargarHome();
});
