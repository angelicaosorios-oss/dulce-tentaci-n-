
document.addEventListener("DOMContentLoaded", function() {

    // CARGAR PRODUCTOS DESTACADOS
    const productos = JSON.parse(
        localStorage.getItem("productosDestacados")
    ) || [];

    const contenedor = document.getElementById("contenedor-destacados");

    if (contenedor) {
        const tarjetas = contenedor.querySelectorAll(".producto");

        productos.forEach(function(producto, indice) {
            const tarjeta = tarjetas[indice];

            if (!tarjeta) return;

            tarjeta.querySelector("b").textContent = producto.nombre;
            tarjeta.querySelector("p").textContent = producto.descripcion;
            tarjeta.querySelector("img").src = producto.imagen;
        });
    }

    // CARGAR BANNER PRINCIPAL
    const bannerGuardado = localStorage.getItem("bannerPrincipal");

    if (bannerGuardado) {
        const primerBanner = document.querySelector(
            "#carouselExampleControls .carousel-item:first-child img"
        );

        if (primerBanner) {
            primerBanner.src = bannerGuardado;
        }
    }

});

