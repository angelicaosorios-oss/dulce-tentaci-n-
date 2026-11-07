<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] ==I "POST") {
    $id_cliente = $_POST['id_cliente'];
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    
    
$sql = "INSERT INTO productos(id_nombre,nombre,telefono,correo)
            VALUES ('$id_cliente', ' $nombre', '$telefono',' $correo')";
            


if ($coon->query($sql) === TRUE) {
    $mensaje = "registro guardado correctamente.";
    $clase = "msg"
}  else  {
    $mensaje =" error: " . $coon->error;  //ejemplo. codigo duplicado
}   $clase = "msg error";
    
}

?>