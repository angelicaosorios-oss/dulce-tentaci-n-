<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] ==I "POST") {
    $id_pedido = $_POST['id_pedido'];
    $fecha = $_POST['fecha'];
    $total = $_POST['total'];
    $id_cliente = $_POST['id_cliente'];
    
    
$sql = "INSERT INTO pedidos(id_pedido, fecha, total, id_cliente)
        VALUES ('$id_pedido', '$fecha', '$total', '$id_cliente')";
            

if ($coon->query($sql) === TRUE) {
    $mensaje = "registro guardado correctamente.";
    $clase = "msg"
}  else  {
    $mensaje =" error: " . $coon->error;  //ejemplo. codigo duplicado
}   $clase = "msg error";
    
}

?>