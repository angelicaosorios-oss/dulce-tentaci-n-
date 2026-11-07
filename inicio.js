const formulario = document.getElementById("formularioLogin");

const mensaje = document.getElementById("mensaje");
const iconoMensaje = document.getElementById("icono-mensaje");
const tituloMensaje = document.getElementById("titulo-mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const cerrarMensaje = document.getElementById("cerrar-mensaje");

let inicioCorrecto = false;


// Función para mostrar el mensaje
function mostrarMensaje(icono, titulo, texto) {

    iconoMensaje.textContent = icono;
    tituloMensaje.textContent = titulo;
    textoMensaje.textContent = texto;

    mensaje.classList.add("mostrar");
}


// Cerrar mensaje
cerrarMensaje.addEventListener("click", function() {

    mensaje.classList.remove("mostrar");

    if (inicioCorrecto) {
        window.location.href = "index.html";
    }

});


// Verificar formulario
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    inicioCorrecto = false;

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();


    // Verificar correo vacío
    if (correo === "") {

        mostrarMensaje(
            "⚠️",
            "Correo vacío",
            "Por favor, ingresa tu correo electrónico."
        );

        return;
    }


    // Verificar correo
    if (!correo.includes("@") || !correo.includes(".")) {

        mostrarMensaje(
            "❌",
            "Correo inválido",
            "Ingresa un correo electrónico válido."
        );

        return;
    }


    // Verificar contraseña vacía
    if (password === "") {

        mostrarMensaje(
            "⚠️",
            "Contraseña vacía",
            "Por favor, ingresa tu contraseña."
        );

        return;
    }


    // Verificar longitud de contraseña
    if (password.length < 6) {

        mostrarMensaje(
            "🔒",
            "Contraseña incorrecta",
            "La contraseña debe tener mínimo 6 caracteres."
        );

        return;
    }


    // Todo está correcto
    inicioCorrecto = true;

    mostrarMensaje(
        "✅",
        "¡Inicio correcto!",
        "Bienvenido a Mi Dulce Rincón."
    );

});