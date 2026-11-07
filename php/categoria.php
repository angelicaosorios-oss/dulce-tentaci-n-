
<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // ELIMINAR CATEGORÍA
    if (isset($_POST["eliminar"])) {

        $id_categoria = (int) $_POST["id_categoria"];

        // No se puede eliminar si todavía tiene productos
        $consulta = $conn->prepare("SELECT COUNT(*) FROM producto WHERE id_categoria = ?");
        $consulta->bind_param("i", $id_categoria);
        $consulta->execute();
        $consulta->bind_result($cantidad);
        $consulta->fetch();
        $consulta->close();

        if ($cantidad > 0) {
            header("Location: ../html/categoria.html?error=productos");
            exit();
        }

        // Buscar la imagen para borrarla también
        $consulta = $conn->prepare("SELECT imagen FROM categoria WHERE id_categoria = ?");
        $consulta->bind_param("i", $id_categoria);
        $consulta->execute();
        $consulta->bind_result($imagen);
        $consulta->fetch();
        $consulta->close();

        $stmt = $conn->prepare("DELETE FROM categoria WHERE id_categoria = ?");
        $stmt->bind_param("i", $id_categoria);

        if ($stmt->execute()) {
            if ($imagen && file_exists(__DIR__ . "/" . $imagen)) {
                unlink(__DIR__ . "/" . $imagen);
            }

            header("Location: ../html/categoria.html?eliminado=correcto");
        } else {
            header("Location: ../html/categoria.html?error=1");
        }
        exit();
    }

    // CREAR CATEGORÍA
    $nombre_categoria = trim($_POST["nombre_categoria"] ?? "");

    if ($nombre_categoria == "") {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    // La imagen es obligatoria
    if (!isset($_FILES["imagen"]) || $_FILES["imagen"]["error"] != 0) {
        header("Location: ../html/categoria.html?error=imagen");
        exit();
    }

    $tipo = mime_content_type($_FILES["imagen"]["tmp_name"]);
    $tiposPermitidos = ["image/jpeg", "image/png"];

    if (!in_array($tipo, $tiposPermitidos) ||
        $_FILES["imagen"]["size"] > 5 * 1024 * 1024) {
        header("Location: ../html/categoria.html?error=imagen");
        exit();
    }

    // Guardar la imagen en img/categorias
    $carpeta = __DIR__ . "/../img/categorias/";

    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0777, true);
    }

    $extension = ($tipo == "image/png") ? ".png" : ".jpg";
    $nombreImagen = uniqid("categoria_") . $extension;

    if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $carpeta . $nombreImagen)) {
        header("Location: ../html/categoria.html?error=imagen");
        exit();
    }

    $imagen = "../img/categorias/" . $nombreImagen;

    $sql = "INSERT INTO categoria (nombre_categoria, imagen) VALUES (?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    $stmt->bind_param("ss", $nombre_categoria, $imagen);

    if ($stmt->execute()) {
        header("Location: ../html/categoria.html?registro=correcto");
        exit();
    } else {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
