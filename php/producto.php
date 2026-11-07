
<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = trim($_POST["nombre_producto"]);
    $descripcion = trim($_POST["descripcion"]);
    $precio = $_POST["precio"];
    $id_categoria = $_POST["id_categoria"];

    // Validar los datos
    if ($nombre == "" || $descripcion == "" || $precio <= 0 || $id_categoria <= 0) {
        header("Location: ../html/crearproductos.html?error=1");
        exit();
    }

    // Preparar la carpeta para las imágenes
    $carpeta = __DIR__ . "/../img/productos/";

    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0777, true);
    }

    $imagen = null;

    // Comprobar si se seleccionó una imagen
    if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] == 0) {

        $tipo = mime_content_type($_FILES["imagen"]["tmp_name"]);
        $tiposPermitidos = ["image/jpeg", "image/png"];

        if (!in_array($tipo, $tiposPermitidos) ||
            $_FILES["imagen"]["size"] > 5 * 1024 * 1024) {
            header("Location: ../html/crearproductos.html?error=1");
            exit();
        }

        $extension = ($tipo == "image/png") ? ".png" : ".jpg";
        $nombreImagen = uniqid("producto_") . $extension;

        if (!move_uploaded_file(
            $_FILES["imagen"]["tmp_name"],
            $carpeta . $nombreImagen
        )) {
            header("Location: ../html/crearproductos.html?error=1");
            exit();
        }

        $imagen = "../img/productos/" . $nombreImagen;
    }

    // Guardar el producto en MySQL
    $sql = "INSERT INTO producto
            (nombre_producto, precio, id_categoria, descripcion, imagen)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param(
            "sdiss",
            $nombre,
            $precio,
            $id_categoria,
            $descripcion,
            $imagen
        );

        if ($stmt->execute()) {
            header("Location: ../html/crearproductos.html?registro=correcto");
            exit();
        }
    }

    header("Location: ../html/crearproductos.html?error=1");
    exit();

} else {
    header("Location: ../html/crearproductos.html");
    exit();
}
?>
