const mensaje = document.getElementById("mensaje");
const iconoMensaje = document.getElementById("icono-mensaje");
const tituloMensaje = document.getElementById("titulo-mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const cerrarMensaje = document.getElementById("cerrar-mensaje");

const formulario = document.getElementById("formulario-contacto");

function mostrarMensaje(icono, titulo, texto) {
    iconoMensaje.textContent = icono;
    tituloMensaje.textContent = titulo;
    textoMensaje.textContent = texto;
    mensaje.classList.add("mostrar");
}

cerrarMensaje.addEventListener("click", function() {
    mensaje.classList.remove("mostrar");
});

// ENVIAR FORMULARIO, GUARDAR EN XAMPP Y ABRIR WHATSAPP
formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        mostrarMensaje("⚠️", "Carrito vacío",
            "Agrega productos antes de realizar tu pedido.");
        return;
    }

    const boton = formulario.querySelector(".pagar");
    boton.disabled = true;
    boton.textContent = "Guardando pedido...";

    try {

        // PRIMERO: GUARDAR LOS DATOS EN MYSQL
        const respuesta = await fetch("../php/contacto.php", {
            method: "POST",
            body: new FormData(formulario)
        });

        const resultado = await respuesta.json();

        if (!resultado.success) {
            throw new Error(resultado.message);
        }

        // SEGUNDO: OBTENER LOS DATOS DEL CLIENTE
        const datos = new FormData(formulario);

        const nombre = datos.get("nombre");
        const apellidos = datos.get("apellidos");
        const correo = datos.get("correo_electronico");
        const telefono = datos.get("telefono");
        const direccion = datos.get("direccion");
        const ciudad = datos.get("ciudad");
        const entrega = datos.get("forma_entrega");
        const pago = datos.get("metodo_pago");
        const solicitud = datos.get("mensaje");

        const formatoPrecio = numero =>
            "$" + Number(numero).toLocaleString("es-CO");

        // TERCERO: CALCULAR EL PEDIDO
        let subtotal = 0;
        let productosTexto = "";

        carrito.forEach(producto => {

            const totalProducto =
                producto.precio * producto.cantidad;

            subtotal += totalProducto;

            productosTexto +=
                `\n- ${producto.nombre} x${producto.cantidad}` +
                ` = ${formatoPrecio(totalProducto)}`;
        });

        const domicilio = entrega === "Envio" ? 5000 : 0;
        const total = subtotal + domicilio;

        // CUARTO: CREAR MENSAJE DE WHATSAPP
        const mensajeWhatsApp =
            "¡Hola! Quiero realizar un pedido en Mi Dulce Rincón.\n\n" +

            "DATOS DEL CLIENTE\n" +
            `Nombre: ${nombre} ${apellidos}\n` +
            `Correo: ${correo}\n` +
            `Teléfono: ${telefono}\n` +
            `Dirección: ${direccion}\n` +
            `Ciudad: ${ciudad}\n\n` +

            "PRODUCTOS\n" +
            productosTexto + "\n\n" +

            `Subtotal: ${formatoPrecio(subtotal)}\n` +
            `Domicilio: ${formatoPrecio(domicilio)}\n` +
            `TOTAL: ${formatoPrecio(total)}\n\n` +

            `Forma de entrega: ${entrega}\n` +
            `Método de pago: ${pago}\n` +
            `Solicitud adicional: ${solicitud || "Ninguna"}`;

        const numeroWhatsApp = "573132243599";

        const url =
            "https://wa.me/" + numeroWhatsApp +
            "?text=" + encodeURIComponent(mensajeWhatsApp);

        // QUINTO: ABRIR WHATSAPP
        window.location.href = url;

    } catch (error) {

        mostrarMensaje(
            "⚠️",
            "Error al enviar",
            error.message || "No se pudieron guardar los datos. Inténtalo nuevamente."
        );

        boton.disabled = false;
        boton.textContent = "Enviar pedido";
    }
});
