<?php
// Crear o eliminar categorías desde el administrador (responde JSON).
//   accion=crear    -> nombre_categoria, archivo (opcional: imagen o modelo .glb)
//   accion=eliminar -> id_categoria
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responderError("Método no permitido.", 405);
}

requerirSesionJSON();

$accion = $_POST["accion"] ?? "crear";

if ($accion === "eliminar") {
    $id = (int) ($_POST["id_categoria"] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) FROM producto WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->get_result()->fetch_row()[0] > 0) {
        responderError("No se puede eliminar: la categoría tiene productos. Elimina o mueve esos productos primero.");
    }

    $stmt = $conn->prepare("SELECT imagen FROM categoria WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();

    if (!$fila) {
        responderError("La categoría no existe.", 404);
    }

    $stmt = $conn->prepare("DELETE FROM categoria WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    eliminarArchivoSubido($fila["imagen"], "categorias");

    responderJSON(["success" => true, "message" => "Categoría eliminada."]);
}

// ----- CREAR -----
$nombre = textoPost("nombre_categoria", 50);

if ($nombre === "") {
    responderError("Escribe el nombre de la categoría.");
}

$stmt = $conn->prepare("SELECT COUNT(*) FROM categoria WHERE nombre_categoria = ?");
$stmt->bind_param("s", $nombre);
$stmt->execute();

if ($stmt->get_result()->fetch_row()[0] > 0) {
    responderError("Ya existe una categoría con ese nombre.");
}

try {
    $archivo = guardarArchivoSubido("archivo", "categorias");
} catch (RuntimeException $e) {
    responderError($e->getMessage());
}

$ruta = $archivo["ruta"] ?? null;
$tipo = $archivo["tipo"] ?? null;

$stmt = $conn->prepare(
    "INSERT INTO categoria (nombre_categoria, imagen, tipo_media) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $nombre, $ruta, $tipo);

try {
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    eliminarArchivoSubido($ruta, "categorias");
    responderError("No se pudo guardar la categoría.");
}

responderJSON([
    "success" => true,
    "message" => "La categoría se guardó y ya aparece en la página principal.",
    "id_categoria" => $conn->insert_id,
]);
