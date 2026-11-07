<?php
// Productos de una categoría.
//   ?categoria=ID        -> por código de categoría
//   ?nombre=Cupcake      -> por nombre de categoría (lo usan las páginas fijas)
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

$id = (int) ($_GET["categoria"] ?? 0);
$nombre = trim($_GET["nombre"] ?? "");

if ($id > 0) {
    $stmt = $conn->prepare("SELECT id_categoria, nombre_categoria, imagen, tipo_media
                            FROM categoria WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
} elseif ($nombre !== "") {
    $stmt = $conn->prepare("SELECT id_categoria, nombre_categoria, imagen, tipo_media
                            FROM categoria WHERE nombre_categoria = ? LIMIT 1");
    $stmt->bind_param("s", $nombre);
} else {
    responderError("Falta la categoría.");
}

$stmt->execute();
$categoria = $stmt->get_result()->fetch_assoc();

if (!$categoria) {
    responderJSON(["success" => true, "categoria" => null, "productos" => []]);
}

$stmt = $conn->prepare(
    "SELECT id_producto, nombre_producto, descripcion, precio, imagen, tipo_media
     FROM producto WHERE id_categoria = ? ORDER BY nombre_producto"
);
$stmt->bind_param("i", $categoria["id_categoria"]);
$stmt->execute();
$productos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$conn->close();

responderJSON([
    "success"   => true,
    "categoria" => $categoria,
    "productos" => $productos,
]);
