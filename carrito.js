let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function formatoPrecio(numero) {

    return "$" + numero.toLocaleString("es-CO");

}
function mostrarCarrito() {

    const lista = document.getElementById("lista-carrito");

    const carritoVacio = document.getElementById("carrito-vacio");

    lista.innerHTML = "";

    if (carrito.length === 0) {

        carritoVacio.style.display = "block";

        document.querySelector(".contenedor").style.display = "none";

        return;

    }

    carritoVacio.style.display = "none";

    document.querySelector(".contenedor").style.display = "grid";


    carrito.forEach((producto, indice) => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("producto-carrito");


        tarjeta.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="info-producto">

                <h3>
                    ${producto.nombre}
                </h3>

                <span class="precio">
                    ${formatoPrecio(producto.precio)}
                </span>

            </div>


            <div class="controles-cantidad">

                <button onclick="cambiarCantidad(${indice}, -1)">
                </button>

                <span class="numero-cantidad">
                    ${producto.cantidad}
                </span>

                <button onclick="cambiarCantidad(${indice}, 1)">
                    +
                </button>

            </div>


            <strong>
                ${formatoPrecio(
                    producto.precio * producto.cantidad
                )}
            </strong>


            <button
                class="btn-eliminar"
                onclick="eliminarProducto(${indice})"
            >
            </button>

        `;

        lista.appendChild(tarjeta);

    });

    calcularTotal();

}
function cambiarCantidad(indice, cambio) {

    carrito[indice].cantidad += cambio;


    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }

    guardarCarrito();

    mostrarCarrito();

}

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    guardarCarrito();

    mostrarCarrito();

}
function calcularTotal() {

    let subtotal = 0;


    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });

    let domicilio = subtotal > 0 ? 5000 : 0;


    let total = subtotal + domicilio;


    document.getElementById("subtotal").textContent =
        formatoPrecio(subtotal);


    document.getElementById("domicilio").textContent =
        formatoPrecio(domicilio);


    document.getElementById("total").textContent =
        formatoPrecio(total);

}

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}
function realizarPedido() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;

    }


    let mensaje =
        "Hola, quiero realizar el siguiente pedido:%0A%0A";


    carrito.forEach(producto => {

        let subtotalProducto =
            producto.precio *
            producto.cantidad;


        mensaje +=
            " " +
            producto.nombre +
            " x" +
            producto.cantidad +
            " - " +
            formatoPrecio(subtotalProducto) +
            "%0A";

    });


    let subtotal = carrito.reduce(
        (total, producto) =>
            total +
            producto.precio *
            producto.cantidad,
        0
    );


    let domicilio = 5000;

    let total = subtotal + domicilio;


    mensaje +=
        "%0ASubtotal: " +
        formatoPrecio(subtotal);


    mensaje +=
        "%0ADomicilio: " +
        formatoPrecio(domicilio);


    mensaje +=
        "%0A*Total: " +
        formatoPrecio(total) +
        "*";

    const numeroWhatsApp = "573001234567";


    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        mensaje;


    window.open(url, "_blank");

}
mostrarCarrito();