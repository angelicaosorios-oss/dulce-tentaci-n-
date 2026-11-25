<?php
session_start();

if (
    !isset($_SESSION['id_usuario']) ||
    !isset($_SESSION['rol']) ||
    $_SESSION['rol'] !== 'administrador' ||
    $_SESSION['correo'] !== 'administrador@midulcerincon.com'
) {
    header("Location: inicio.html");
    exit();
}
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Crear producto | Dulce Rincón</title>

    <link rel="stylesheet" href="../css/crear productos.css" />

    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
    ></script>
  </head>

  <body>
    <aside class="sidebar">
      <div class="logo">
        <span>Dulce Rincón</span>
      </div>

      <p class="subtitulo">Panel de administración</p>

      <nav>
        <a href="../html/index.php" class="activo"> Productos </a>

        <a href="../html/categoria.php"> Categorías </a>

        <a href="../html/index.php" >producto</a>

      </nav>

      <a href="../html/inicio.html" class="cerrar"> Cerrar sesión </a>
    </aside>

    <main class="contenido">
      <header class="barra">
        <div class="nombre">
          <i>Dulce Rincón</i>
        </div>

        <div class="usuario"></div>
      </header>

      <section class="formulario">
        <div class="titulo">
          <h1>Crear producto</h1>

          <p>Agrega un nuevo producto a tu tienda.</p>
        </div>

        <form id="formProducto" action="../php/producto.php" method="POST" enctype="multipart/form-data">
          <label>Nombre del producto</label>
          <input
            type="text"
            id="nombre"
            name="nombre_producto"
            placeholder="Ej: Torta de chocolate"
            required
          />

          <label>Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Describe el producto..."
            required
          ></textarea>

          <label>Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            placeholder="$ 0"
            required
          />

          <label>Categoría</label>
          <select id="categoria" name="id_categoria" required>
    <option value="">Selecciona una categoría</option>
</select>



          <label>Modelo 3D del producto</label>

          <div class="subir-imagen">
            <span></span>
            <p>Selecciona el modelo 3D</p>
            <small>Archivo GLB (máximo 20 MB)</small>

            <input
              type="file"
              id="imagen"
              name="imagen"
              accept=".glb"
              required
            /><img id="vistaPrevia" src="" alt="Vista previa del producto" style="display: none; max-width: 200px;">

          <div class="botones">
            <a href="../html/index.html" class="cancelar">Cancelar</a>
            <button type="submit" class="guardar">GUARDAR PRODUCTO</button>
          </div>
        </form>
      </section>
    </main>
    <div id="mensaje" class="mensaje">
      <div class="mensaje-contenido">
        <span id="icono-mensaje"></span>
        <h3 id="titulo-mensaje"></h3>
        <p id="texto-mensaje"></p>
        <button id="cerrar-mensaje">Aceptar</button>
      </div>
    </div>
    <script src="../js/crearproducto.js"></script>
  </body>
</html>
