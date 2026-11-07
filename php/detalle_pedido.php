<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] ==I "POST") {
    $id_detalles = $_POST['id_detalles'];
    $id_pedido = $_POST['id_pedido'];
    $id_producto = $_POST['id_producto'];
    $cantidad = $_POST['cantidad'];
    $subtotal = $_POST['subtotal'];
    
$sql = "INSERT INTO detalles(id_detalles, id_pedido, id_producto, cantidad, subtotal)
        VALUES ('$id_detalles', '$id_pedido', '$id_producto', '$cantidad', '$subtotal')";
          
if ($coon->query($sql) === TRUE) {
    $mensaje = "registro guardado correctamente.";
    $clase = "msg"
}  else  {
    $mensaje =" error: " . $coon->error;  //ejemplo. codigo duplicado
}   $clase = "msg error";
    

}

?>