<?php
// Registrar un pedido (responde JSON). Campos: id_cliente, total, fecha (opcional)
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

$idCliente = (int) ($_POST["id_cliente"] ?? 0);
$total = (float) ($_POST["total"] ?? 0);
$fecha = trim($_POST["fecha"] ?? "") ?: date("Y-m-d H:i:s");

if ($idCliente <= 0 || $total <= 0) {
    responderError("Faltan el cliente o el total del pedido.");
}

try {
    $stmt = $conn->prepare("INSERT INTO pedido (fecha, total, id_cliente) VALUES (?, ?, ?)");
    $stmt->bind_param("sdi", $fecha, $total, $idCliente);
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    responderError("No se pudo guardar el pedido. ¿Existe el cliente?");
}

responderJSON([
    "success" => true,
    "message" => "Pedido guardado correctamente.",
    "id_pedido" => $conn->insert_id,
]);
