<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre_categoria = trim($_POST["nombre_categoria"] ?? "");

    if ($nombre_categoria == "") {
        header("Location: ../html/categoria.html?error=nombre");
        exit();
    }

    // La imagen de la categoría (JPG, PNG o WEBP) es obligatoria
    $errorSubida = $_FILES["imagen"]["error"] ?? UPLOAD_ERR_NO_FILE;

    if ($errorSubida == UPLOAD_ERR_INI_SIZE || $errorSubida == UPLOAD_ERR_FORM_SIZE) {
        header("Location: ../html/categoria.html?error=tamano");
        exit();
    }

    if ($errorSubida != UPLOAD_ERR_OK) {
        header("Location: ../html/categoria.html?error=sin_imagen");
        exit();
    }

    $temporal = $_FILES["imagen"]["tmp_name"];
    $tipo = mime_content_type($temporal);

    if ($tipo == "image/png") {
        $extension = ".png";
    } elseif ($tipo == "image/jpeg") {
        $extension = ".jpg";
    } elseif ($tipo == "image/webp") {
        $extension = ".webp";
    } else {
        header("Location: ../html/categoria.html?error=formato");
        exit();
    }

    if ($_FILES["imagen"]["size"] > 5 * 1024 * 1024) {
        header("Location: ../html/categoria.html?error=tamano");
        exit();
    }

    // Guardar la imagen en img/categorias/
    $carpeta = __DIR__ . "/../img/categorias/";

    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0777, true);
    }

    $nombreImagen = uniqid("categoria_") . $extension;

    if (!move_uploaded_file($temporal, $carpeta . $nombreImagen)) {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    $imagen = "../img/categorias/" . $nombreImagen;

    // Guardar la categoría en MySQL
    $sql = "INSERT INTO categoria (nombre_categoria, imagen) VALUES (?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ss", $nombre_categoria, $imagen);

        try {
            if ($stmt->execute()) {
                header("Location: ../html/categoria.html?registro=correcto");
                exit();
            }
        } catch (mysqli_sql_exception $e) {
            // se muestra el mensaje de error de abajo
        }
    }

    // Si no se pudo guardar, se borra la imagen que ya se había subido
    unlink($carpeta . $nombreImagen);

    header("Location: ../html/categoria.html?error=1");
    exit();
}
?>
