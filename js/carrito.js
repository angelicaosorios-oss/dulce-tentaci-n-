
// Necesita ../js/medios.js cargado antes (formatoPrecio, escaparHTML, crearMedio)

const COSTO_DOMICILIO = 5000;

function leerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * AGREGAR PRODUCTOS
 * agregarAlCarrito(nombre, precio, archivo)            -> páginas fijas
 * agregarAlCarrito(nombre, precio, archivo, idProducto) -> productos de la base de datos
 * "archivo" puede ser una imagen o un modelo 3D .glb
 */
function agregarAlCarrito(nombre, precio, archivo, idProducto) {
    const carrito = leerCarrito();
    const id = idProducto ? "bd-" + idProducto : nombre;

    const existente = carrito.find(producto => producto.id_producto === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id_producto: id,
            nombre: nombre,
            precio: Number(precio),
            imagen: archivo || "",
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    window.location.href = "../html/carrito.html";
}

// MOSTRAR PRODUCTOS
function mostrarCarrito() {
    const carrito = leerCarrito();
    const lista = document.getElementById("lista-carrito");
    const carritoVacio = document.getElementById("carrito-vacio");

    if (!lista) return;

    lista.innerHTML = "";

    if (carritoVacio) {
        carritoVacio.style.display = carrito.length === 0 ? "block" : "none";
    }

    carrito.forEach((producto, indice) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-carrito";

        if (producto.imagen) {
            tarjeta.appendChild(crearMedio(producto.imagen, null, { alt: producto.nombre }));
        }

        const info = document.createElement("div");
        info.className = "info-producto";
        info.innerHTML = `
            <h3>${escaparHTML(producto.nombre)}</h3>
            <p class="precio">${formatoPrecio(producto.precio)}</p>
            <p>Subtotal: ${formatoPrecio(producto.precio * producto.cantidad)}</p>
            <div class="controles-cantidad">
                <button type="button" onclick="cambiarCantidad(${indice}, -1)">-</button>
                <span class="numero-cantidad">${producto.cantidad}</span>
                <button type="button" onclick="cambiarCantidad(${indice}, 1)">+</button>
                <button type="button" class="btn-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
            </div>
        `;

        tarjeta.appendChild(info);
        lista.appendChild(tarjeta);
    });

    calcularTotal(carrito);
}

// CAMBIAR CANTIDAD
function cambiarCantidad(indice, cambio) {
    const carrito = leerCarrito();

    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    mostrarCarrito();
}

// ELIMINAR PRODUCTOS
function eliminarProducto(indice) {
    const carrito = leerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

// CALCULAR TOTAL
// El domicilio se muestra como estimado: en contacto solo se cobra si eliges "Envío".
function calcularTotal(carrito) {
    const subtotal = carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );

    const domicilio = subtotal > 0 ? COSTO_DOMICILIO : 0;

    const elementoSubtotal = document.getElementById("subtotal");
    const elementoDomicilio = document.getElementById("domicilio");
    const elementoTotal = document.getElementById("total");

    if (elementoSubtotal) elementoSubtotal.textContent = formatoPrecio(subtotal);
    if (elementoDomicilio) elementoDomicilio.textContent = formatoPrecio(domicilio);
    if (elementoTotal) elementoTotal.textContent = formatoPrecio(subtotal + domicilio);
}

// REALIZAR PEDIDO: IR A CONTACTO
function realizarPedido() {
    if (leerCarrito().length === 0) {
        const carritoVacio = document.getElementById("carrito-vacio");
        if (carritoVacio) carritoVacio.style.display = "block";
        return;
    }

    window.location.href = "../html/contacto.html";
}

document.addEventListener("DOMContentLoaded", mostrarCarrito);
