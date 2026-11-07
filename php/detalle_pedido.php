<?php
// Registrar un producto dentro de un pedido (responde JSON).
// Campos: id_pedido, id_producto, cantidad, subtotal
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

$idPedido = (int) ($_POST["id_pedido"] ?? 0);
$idProducto = (int) ($_POST["id_producto"] ?? 0);
$cantidad = (int) ($_POST["cantidad"] ?? 0);
$subtotal = (float) ($_POST["subtotal"] ?? 0);

if ($idPedido <= 0 || $idProducto <= 0 || $cantidad <= 0 || $subtotal <= 0) {
    responderError("Datos del detalle incompletos.");
}

try {
    $stmt = $conn->prepare(
        "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param("iiid", $idPedido, $idProducto, $cantidad, $subtotal);
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    responderError("No se pudo guardar el detalle. ¿Existen el pedido y el producto?");
}

responderJSON([
    "success" => true,
    "message" => "Detalle guardado correctamente.",
    "id_detalle" => $conn->insert_id,
]);
