<?php
// Todo lo que necesita la página principal (index.html) en una sola consulta.
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

$destacados = $conn->query(
    "SELECT posicion, titulo, descripcion, archivo, tipo_media, texto_alt, auto_rotar
     FROM destacado ORDER BY posicion"
)->fetch_all(MYSQLI_ASSOC);

$carrusel = $conn->query(
    "SELECT id_carrusel, titulo, descripcion, archivo, tipo_media, texto_alt, auto_rotar, orden
     FROM carrusel ORDER BY orden, id_carrusel"
)->fetch_all(MYSQLI_ASSOC);

$categorias = $conn->query(
    "SELECT id_categoria, nombre_categoria, imagen, tipo_media
     FROM categoria ORDER BY nombre_categoria"
)->fetch_all(MYSQLI_ASSOC);

$conn->close();

responderJSON([
    "destacados" => $destacados,
    "carrusel"   => $carrusel,
    "categorias" => $categorias,
]);
