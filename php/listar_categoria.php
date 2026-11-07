<?php
require("conexion.php");

header("Content-Type: application/json; charset=UTF-8");

$sql = "SELECT id_categoria, nombre_categoria FROM categoria";
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