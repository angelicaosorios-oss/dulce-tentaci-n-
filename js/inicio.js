
const formulario = document.getElementById("formularioLogin");

const mensaje = document.getElementById("mensaje");
const iconoMensaje = document.getElementById("icono-mensaje");
const tituloMensaje = document.getElementById("titulo-mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const cerrarMensaje = document.getElementById("cerrar-mensaje");

function mostrarMensaje(icono, titulo, texto) {

    iconoMensaje.textContent = icono;
    tituloMensaje.textContent = titulo;
    textoMensaje.textContent = texto;

    mensaje.classList.add("mostrar");
}

// Cerrar mensaje
cerrarMensaje.addEventListener("click", function() {
    mensaje.classList.remove("mostrar");
});

// Verificar formulario
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (correo === "") {
        mostrarMensaje("", "Correo vacío",
        "Por favor, ingresa tu correo electrónico.");
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        mostrarMensaje("", "Correo inválido",
        "Ingresa un correo electrónico válido.");
        return;
    }

    if (password === "") {
        mostrarMensaje("", "Contraseña vacía",
        "Por favor, ingresa tu contraseña.");
        return;
    }

    if (password.length < 6) {
        mostrarMensaje("", "Contraseña incorrecta",
        "La contraseña debe tener mínimo 6 caracteres.");
        return;
    }

    // Enviar los datos a PHP para comprobarlos
    formulario.submit();

});

// Mostrar mensajes enviados desde PHP
const parametros = new URLSearchParams(window.location.search);

if (parametros.get("error") === "no_registrado") {

    mostrarMensaje(
        "✉️",
        "¡Correo no registrado!",
        "El correo no está registrado. Por favor, verifica tus datos o regístrate."
    );

}

if (parametros.get("error") === "incorrecta") {

    mostrarMensaje(
        "🔒",
        "Contraseña incorrecta",
        "La contraseña ingresada no es correcta. Inténtalo nuevamente."
    );

}
