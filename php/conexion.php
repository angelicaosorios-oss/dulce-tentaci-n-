<?php 
$servername = "localhost";  // servidor
$username = "root";  // usuario de MySQL
$password = "";  // contraseña
$dbname = "mi_dulce_rincon";  //nombre de la base de datos 
$port = 3307;
 // crear conexion

$conn = new mysqli($servername, $username, $password, $dbname);

// verificar conexion
if ($conn->connect_error) {
    die("conexion fallida: " . $conn->connect_error);
}

// usar UTF-8 para que las tildes y la ñ se vean bien
$conn->set_charset("utf8mb4");
?>
