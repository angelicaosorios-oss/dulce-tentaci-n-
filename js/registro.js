
const mensaje = document.getElementById("mensaje");
const iconoMensaje = document.getElementById("icono-mensaje");
const tituloMensaje = document.getElementById("titulo-mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const cerrarMensaje = document.getElementById("cerrar-mensaje");

const parametros = new URLSearchParams(window.location.search);

function mostrarMensaje(icono, titulo, texto) {
    iconoMensaje.textContent = icono;
    tituloMensaje.textContent = titulo;
    textoMensaje.textContent = texto;
    mensaje.classList.add("mostrar");
}

cerrarMensaje.addEventListener("click", function() {
    mensaje.classList.remove("mostrar");

    if (parametros.get("registro") === "correcto") {
        window.location.href = "inicio.html";
    }
});

if (parametros.get("registro") === "correcto") {
    mostrarMensaje("🎂", "¡Registro exitoso!", "Tus datos se guardaron correctamente. Ya puedes iniciar sesión.");
}

if (parametros.get("error") === "1") {
    mostrarMensaje("⚠️", "¡Ups! Algo salió mal", "No fue posible completar tu registro. Inténtalo nuevamente.");
}
if (parametros.get("error") === "duplicado") {
    mostrarMensaje(
        "⚠️",
        "¡Correo ya registrado!",
        "Este correo ya tiene una cuenta. Intenta con otro correo."
    );
}