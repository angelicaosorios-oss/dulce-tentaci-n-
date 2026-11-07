<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $password = $_POST['password'];

    $password = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        header("Location: ../html/registro.html?error=1");
        exit();
    }

    $stmt->bind_param("sss", $nombre, $correo, $password);

   try {
    if ($stmt->execute()) {
        header("Location: ../html/registro.html?registro=correcto");
        exit();
    }
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        header("Location: ../html/registro.html?error=duplicado");
        exit();
    }

    header("Location: ../html/registro.html?error=1");
    exit();
}

    $stmt->close();
    $conn->close();
}
?>

