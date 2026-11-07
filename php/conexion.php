<?php
require_once __DIR__ . "/config.php";

// Los errores de MySQL se lanzan como excepciones (mysqli_sql_exception)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli(DB_SERVIDOR, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);
    // utf8mb4 para que tildes, ñ y emojis se guarden bien
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    die("Conexión fallida: " . $e->getMessage()
        . ". ¿Ya ejecutaste php/instalar.php?");
}
