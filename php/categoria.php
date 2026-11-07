
<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre_categoria = trim($_POST["nombre_categoria"] ?? "");

    if ($nombre_categoria == "") {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    $sql = "INSERT INTO categoria (nombre_categoria) VALUES (?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        header("Location: ../html/categoria.html?error=1");
        exit();
    }

    $stmt->bind_param("s", $nombre_categoria);

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


