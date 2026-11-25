<?php
// Devuelve en JSON los productos de una categoría.
// Uso: listar_productos.php?categoria=Cupcakes
require("conexion.php");

header("Content-Type: application/json; charset=UTF-8");

$categoria = trim($_GET["categoria"] ?? "");

$sql = "SELECT p.id_producto, p.nombre_producto, p.sabor, p.precio,
               p.descripcion, p.imagen, c.nombre_categoria
        FROM producto p
        JOIN categoria c ON c.id_categoria = p.id_categoria";

if ($categoria !== "") {
    $sql .= " WHERE c.nombre_categoria = ?";
}

$sql .= " ORDER BY p.id_producto";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudieron consultar los productos."]);
    exit();
}

if ($categoria !== "") {
    $stmt->bind_param("s", $categoria);
}

$stmt->execute();
$resultado = $stmt->get_result();

$productos = [];

while ($fila = $resultado->fetch_assoc()) {
    $fila["precio"] = (float) $fila["precio"];
    $productos[] = $fila;
}

echo json_encode($productos, JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>
