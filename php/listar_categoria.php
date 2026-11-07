<?php
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

activarErroresJSON();

$resultado = $conn->query(
    "SELECT c.id_categoria, c.nombre_categoria, c.imagen, c.tipo_media,
            COUNT(p.id_producto) AS total_productos
     FROM categoria c
     LEFT JOIN producto p ON p.id_categoria = c.id_categoria
     GROUP BY c.id_categoria
     ORDER BY c.nombre_categoria"
);

$conn->close();

responderJSON($resultado->fetch_all(MYSQLI_ASSOC));
