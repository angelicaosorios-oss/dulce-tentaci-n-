<?php
session_start();

$esAdministrador = (
    isset($_SESSION['id_usuario']) &&
    isset($_SESSION['rol']) &&
    $_SESSION['rol'] === 'administrador' &&
    isset($_SESSION['correo']) &&
    $_SESSION['correo'] === 'administrador@midulcerincon.com'
);
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>dulce Rincón</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"/>

    <link rel="stylesheet" href="../css/home.css" />
  </head>

  <body>
    <div
      id="carouselExampleControls"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <style>
        .carousel-item {
          text-align: center;
        }
        .carousel-item img {
          width: 70%;
          height: 400px;
          object-fit: cover;
          margin: auto;
          display: block;
          border-radius: 10px;
        }
      </style>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
            class="d-block"
            alt="Torta"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80"
            class="d-block"
            alt="Cupcakes"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://www.tortasytortas.com.co/images/virtuemart/product/resized/miloj%C3%B3n%20fresa-maracuy%C3%A1%20web_640x200.jpg"
            class="d-block"
            alt="Postres"
          />
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon"></span>
      </button>

      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <section class="presentacion">
      <div class="texto">
        <h1>MI DULCE RINCÓN</h1>

        <h3>— REPOSTERÍA —</h3>

        <p>
          Deliciosos postres hechos con mucho amor y dedicación. Encuentra
          tortas, cupcakes, brownies y muchas más opciones para disfrutar en
          cualquier ocasión.
        </p>

      
      </div>
    </section>
<section class="destacados">
    <h2>PRODUCTOS DESTACADOS</h2>

    <div class="contenedor-productos">

        <div class="producto">
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" alt="Postres">
            <div>
                <b>Deliciosos postres</b>
                <p>Los favoritos de nuestros clientes</p>
            </div>
        </div>

        <div class="producto">
            <img src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80" alt="Galletas">
            <div>
                <b>Galletas especiales</b>
                <p>Perfectas para cualquier ocasión</p>
            </div>
        </div>

        <div class="producto">
            <img src="https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=300&q=80" alt="Promociones">
            <div>
                <b>Promociones</b>
                <p>Disfruta nuestras ofertas</p>
            </div>
        </div>

    </div>
</section>
    <section class="productos">
      <h2>NUESTROS PRODUCTOS</h2>

      <div class="contenedor-productos" id="contenedor-categorias">
        <div class="producto">
          <img
            src="https://us.123rf.com/450wm/mikkiorso/mikkiorso2504/mikkiorso250430566/245635797-charming-pastel-milkshakes-with-floral-straws-and-ice-cubes-on-a-pink-background-for-custom-text.jpg?ver=6"
            alt="Malteada"
          />
<br>
          <a class="button is -link" type="button" href="../html/malteada.html" ><h3>Malteada</h3></a>
        </div>

        <div class="producto">
          <img
            src="https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=300&q=80"
            alt="Cupcake"
          />
<br>
          <a class="button is -link" type="button" href="../html/cupcake.html"><h3>Cupcake</h3></a>
        </div>

        <div class="producto">
          <img
            src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80"
            alt="Galletas"
          />
<br>
          <a class="button is -link" type="button" href="../html/galletas.html" ><h3>Galletas</h3></a>
        </div>

        <div class="producto">
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80"
            alt="Cheesecake"
          /> 

<br>
          <a class="button is -link" type="button" href="../html/Cheesecakes.html"><h3>Cheesecakes</h3></a>
        </div>

        <div class="producto">
          <img
            src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80"
            alt="Helado"
          />
<br>
          <a class="button is -link" href="../html/helados.html">
    <h3>Helado</h3>
</a>
        </div>
      </div>
    </section>
    <nav class="opciones-home">
    <?php if ($esAdministrador): ?>
    <a href="categoria.php" class="categoria">
        Volver a administración
    </a>
<?php endif; ?>

    <a href="../html/inicio.html" class="cerrar">
        ↪ Cerrar sesión
    </a>
</nav>
        <script>
// CAMBIOS HECHOS DESDE EL ADMINISTRADOR (Administrar home)
function aplicarCambiosHome() {

    // CARGAR BANNER PRINCIPAL
    const bannerGuardado = localStorage.getItem("bannerPrincipal");

    if (bannerGuardado) {
        const imagenBanner = document.querySelector(
            "#carouselExampleControls .carousel-item:first-child img"
        );

        if (imagenBanner) {
            imagenBanner.src = bannerGuardado;
        }
    }

    // CARGAR PRODUCTOS DESTACADOS
    const productosGuardados = JSON.parse(
        localStorage.getItem("productosDestacados")
    ) || [];

    const tarjetas = document.querySelectorAll(
        ".destacados .producto"
    );

    tarjetas.forEach(function (tarjeta, indice) {

        const producto = productosGuardados[indice];

        if (producto) {
            const imagen = tarjeta.querySelector("img");
            const nombre = tarjeta.querySelector("b");
            const descripcion = tarjeta.querySelector("p");

            if (imagen && producto.imagen) {
                imagen.src = producto.imagen;
            }

            if (nombre && producto.nombre) {
                nombre.textContent = producto.nombre;
            }

            if (descripcion && producto.descripcion) {
                descripcion.textContent = producto.descripcion;
            }
        }
    });

}

document.addEventListener("DOMContentLoaded", aplicarCambiosHome);

// Si el administrador cambia algo mientras el home está abierto, se actualiza solo
window.addEventListener("storage", function (evento) {
    if (evento.key === "bannerPrincipal" || evento.key === "productosDestacados") {
        aplicarCambiosHome();
    }
});
</script>
    <script>
// CATEGORÍAS CREADAS DESDE EL ADMINISTRADOR

document.addEventListener("DOMContentLoaded", async function () {
    const contenedor = document.getElementById("contenedor-categorias");
    const fijas = ["malteadas", "cupcakes", "galletas", "cheesecakes", "helados"];

    try {
        const categorias = await fetch("../php/listar_categoria.php").then(r => r.json());

        categorias
            .filter(c => !fijas.includes(c.nombre_categoria.trim().toLowerCase()))
            .forEach(function (categoria) {
                const tarjeta = document.createElement("div");
                tarjeta.className = "producto";

                const imagen = document.createElement("img");
                imagen.src = categoria.imagen || "../img/fondoinicio.jpeg";
                imagen.alt = categoria.nombre_categoria;

                const enlace = document.createElement("a");
                enlace.className = "button is -link";
                enlace.href = "../html/productos.html?categoria=" +
                    encodeURIComponent(categoria.nombre_categoria);

                const nombre = document.createElement("h3");
                nombre.textContent = categoria.nombre_categoria;
                enlace.appendChild(nombre);

                tarjeta.appendChild(imagen);
                tarjeta.appendChild(document.createElement("br"));
                tarjeta.appendChild(enlace);
                contenedor.appendChild(tarjeta);
            });

    } catch (error) {
        console.error("No se pudieron cargar las categorías nuevas:", error);
    }
});
</script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
