<?php
require_once __DIR__ . "/utilidades.php";

iniciarSesion();
$_SESSION = [];
session_destroy();

header("Location: ../html/inicio.html");
exit();
