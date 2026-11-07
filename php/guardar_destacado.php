<?php
// Edita una de las 3 tarjetas de "Productos destacados".
// Campos: posicion (1-3), titulo, descripcion, texto_alt, auto_rotar, archivo (opcional)
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

requerirSesionJSON();

$posicion = (int) ($_POST["posicion"] ?? 0);
$titulo = textoPost("titulo", 100);
$descripcion = textoPost("descripcion", 255);
$textoAlt = textoPost("texto_alt", 150);
$autoRotar = isset($_POST["auto_rotar"]) ? 1 : 0;

if ($posicion < 1 || $posicion > 3) {
    responderError("Producto destacado no válido.");
}

if ($titulo === "") {
    responderError("Escribe el nombre del producto destacado.");
}

$stmt = $conn->prepare("SELECT archivo, tipo_media FROM destacado WHERE posicion = ?");
$stmt->bind_param("i", $posicion);
$stmt->execute();
$actual = $stmt->get_result()->fetch_assoc();

try {
    $nuevo = guardarArchivoSubido("archivo", "home");
} catch (RuntimeException $e) {
    responderError($e->getMessage());
}

if (!$nuevo && !$actual) {
    responderError("Selecciona una imagen o un modelo 3D.");
}

$archivo = $nuevo["ruta"] ?? $actual["archivo"];
$tipo = $nuevo["tipo"] ?? $actual["tipo_media"];

$stmt = $conn->prepare(
    "REPLACE INTO destacado (posicion, titulo, descripcion, archivo, tipo_media, texto_alt, auto_rotar)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("isssssi", $posicion, $titulo, $descripcion, $archivo, $tipo, $textoAlt, $autoRotar);

try {
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    eliminarArchivoSubido($nuevo["ruta"] ?? null, "home");
    responderError("No se pudo guardar. Revisa los textos e inténtalo de nuevo.");
}

if ($nuevo && $actual) {
    eliminarArchivoSubido($actual["archivo"], "home");
}

responderJSON(["success" => true, "message" => "Producto destacado actualizado."]);
