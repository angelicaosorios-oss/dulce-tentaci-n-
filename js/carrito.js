
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FORMATO DE PRECIOS
function formatoPrecio(numero) {
    return "$" + Number(numero).toLocaleString("es-CO");
}

// GUARDAR CARRITO
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// AGREGAR PRODUCTOS
function agregarAlCarrito(id_producto, nombre, precio, imagen) {
    // Las páginas de galletas, helados, etc. envían solo 3 datos: (nombre, precio, imagen)
    if (imagen === undefined) {
        imagen = precio;
        precio = nombre;
        nombre = id_producto;
    }

    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let productoExistente = carrito.find(
        producto => producto.id_producto === id_producto
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id_producto: id_producto,
            nombre: nombre,
            precio: Number(precio),
            imagen: imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    window.location.href = "../html/carrito.html";
}

// MOSTRAR PRODUCTOS
function mostrarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const lista = document.getElementById("lista-carrito");
    const carritoVacio = document.getElementById("carrito-vacio");

    if (!lista) return;

    lista.innerHTML = "";

    if (carrito.length === 0) {
        if (carritoVacio) carritoVacio.style.display = "block";
        calcularTotal();
        return;
    }

    if (carritoVacio) carritoVacio.style.display = "none";

    carrito.forEach((producto, indice) => {
        lista.innerHTML += `
            <div class="producto-carrito">

                <model-viewer
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    camera-controls
                    auto-rotate>
                </model-viewer>

                <div class="info-producto">

                    <h3>${producto.nombre}</h3>

                    <p class="precio">
                        ${formatoPrecio(producto.precio)}
                    </p>

                    <p>
                        Subtotal:
                        ${formatoPrecio(producto.precio * producto.cantidad)}
                    </p>

                    <div class="controles-cantidad">

                        <button onclick="cambiarCantidad(${indice}, -1)">-</button>

                        <span class="numero-cantidad">
                            ${producto.cantidad}
                        </span>

                        <button onclick="cambiarCantidad(${indice}, 1)">+</button>

                        <button class="btn-eliminar"
                            onclick="eliminarProducto(${indice})">
                            Eliminar
                        </button>

                    </div>
                </div>
            </div>
        `;
    });

    calcularTotal();
}

// CAMBIAR CANTIDAD
function cambiarCantidad(indice, cambio) {
    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito();
    mostrarCarrito();
}

// ELIMINAR PRODUCTOS
function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

// CALCULAR TOTAL
function calcularTotal() {
    let subtotal = carrito.reduce(
        (total, producto) =>
            total + producto.precio * producto.cantidad,
        0
    );

    let domicilio = subtotal > 0 ? 5000 : 0;
    let total = subtotal + domicilio;

    const elementoSubtotal = document.getElementById("subtotal");
    const elementoDomicilio = document.getElementById("domicilio");
    const elementoTotal = document.getElementById("total");

    if (elementoSubtotal) {
        elementoSubtotal.textContent = formatoPrecio(subtotal);
    }

    if (elementoDomicilio) {
        elementoDomicilio.textContent = formatoPrecio(domicilio);
    }

    if (elementoTotal) {
        elementoTotal.textContent = formatoPrecio(total);
    }
}

// REALIZAR PEDIDO: IR A CONTACTO
function realizarPedido() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    window.location.href = "../html/contacto.html";
}

// INICIAR CARRITO
document.addEventListener("DOMContentLoaded", function() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    mostrarCarrito();
});
