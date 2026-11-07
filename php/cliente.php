<?php
// Registrar un cliente (responde JSON). Campos: nombre, telefono, correo
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

$nombre = textoPost("nombre", 100);
$telefono = textoPost("telefono", 20);
$correo = textoPost("correo", 100);

if ($nombre === "" || $telefono === "" || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responderError("Revisa el nombre, el teléfono y el correo.");
}

$stmt = $conn->prepare("INSERT INTO cliente (nombre, telefono, correo) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nombre, $telefono, $correo);
$stmt->execute();

responderJSON([
    "success" => true,
    "message" => "Registro guardado correctamente.",
    "id_cliente" => $conn->insert_id,
]);
