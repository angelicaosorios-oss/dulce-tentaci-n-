<?php
require("conexion.php");

header("Content-Type: application/json; charset=UTF-8");

$sql = "SELECT * FROM categoria";
$resultado = $conn->query($sql);

$categorias = [];

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $categorias[] = $fila;
    }
}

echo json_encode($categorias);

$conn->close();
?>