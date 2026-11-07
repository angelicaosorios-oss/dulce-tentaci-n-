<?php
// Administra las diapositivas del carrusel del index.
//   accion=guardar  -> id_carrusel (vacío = nueva), titulo, descripcion, texto_alt,
//                      auto_rotar, orden, archivo (obligatorio si es nueva)
//   accion=eliminar -> id_carrusel
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

requerirSesionJSON();

$accion = $_POST["accion"] ?? "guardar";
$id = (int) ($_POST["id_carrusel"] ?? 0);

$actual = null;

if ($id > 0) {
    $stmt = $conn->prepare("SELECT archivo, tipo_media FROM carrusel WHERE id_carrusel = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $actual = $stmt->get_result()->fetch_assoc();

    if (!$actual) {
        responderError("La diapositiva no existe.", 404);
    }
}

if ($accion === "eliminar") {
    $total = $conn->query("SELECT COUNT(*) FROM carrusel")->fetch_row()[0];

    if ($total <= 1) {
        responderError("El carrusel necesita al menos una diapositiva.");
    }

    $stmt = $conn->prepare("DELETE FROM carrusel WHERE id_carrusel = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    eliminarArchivoSubido($actual["archivo"], "home");

    responderJSON(["success" => true, "message" => "Diapositiva eliminada."]);
}

// ----- GUARDAR (crear o editar) -----
$titulo = textoPost("titulo", 100);
$descripcion = textoPost("descripcion", 255);
$textoAlt = textoPost("texto_alt", 150);
$autoRotar = isset($_POST["auto_rotar"]) ? 1 : 0;
$orden = (int) ($_POST["orden"] ?? 0);

try {
    $nuevo = guardarArchivoSubido("archivo", "home");
} catch (RuntimeException $e) {
    responderError($e->getMessage());
}

if (!$nuevo && !$actual) {
    responderError("Selecciona una imagen o un modelo 3D para la diapositiva.");
}

$archivo = $nuevo["ruta"] ?? $actual["archivo"];
$tipo = $nuevo["tipo"] ?? $actual["tipo_media"];

if ($actual) {
    $stmt = $conn->prepare(
        "UPDATE carrusel SET titulo = ?, descripcion = ?, archivo = ?, tipo_media = ?,
                texto_alt = ?, auto_rotar = ?, orden = ?
         WHERE id_carrusel = ?"
    );
    $stmt->bind_param("sssssiii", $titulo, $descripcion, $archivo, $tipo, $textoAlt, $autoRotar, $orden, $id);
} else {
    $stmt = $conn->prepare(
        "INSERT INTO carrusel (titulo, descripcion, archivo, tipo_media, texto_alt, auto_rotar, orden)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssssii", $titulo, $descripcion, $archivo, $tipo, $textoAlt, $autoRotar, $orden);
}

try {
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    eliminarArchivoSubido($nuevo["ruta"] ?? null, "home");
    responderError("No se pudo guardar. Revisa los textos e inténtalo de nuevo.");
}

if ($nuevo && $actual) {
    eliminarArchivoSubido($actual["archivo"], "home");
}

responderJSON(["success" => true, "message" => "Carrusel actualizado."]);
