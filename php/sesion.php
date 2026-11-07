<?php
// Dice al JavaScript si hay una sesión iniciada.
require_once __DIR__ . "/utilidades.php";

iniciarSesion();

responderJSON([
    "logueado" => isset($_SESSION["id_usuario"]),
    "nombre"   => $_SESSION["nombre"] ?? null,
]);
