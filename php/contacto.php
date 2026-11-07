
<?php
require("conexion.php");

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $correo_electronico = $_POST['correo_electronico'] ?? '';
    $novedades = isset($_POST['novedades']) ? 1 : 0;
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $direccion = $_POST['direccion'] ?? '';
    $ciudad = $_POST['ciudad'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';
    $forma_entrega = $_POST['forma_entrega'] ?? '';
    $metodo_pago = $_POST['metodo_pago'] ?? '';

    $sql = "INSERT INTO contacto
    (correo_electronico, novedades, nombre, apellidos, telefono,
    direccion, ciudad, mensaje, forma_entrega, metodo_pago)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => "No se pudo preparar el registro."
        ]);
        exit();
    }

    $stmt->bind_param(
        "sissssssss",
        $correo_electronico,
        $novedades,
        $nombre,
        $apellidos,
        $telefono,
        $direccion,
        $ciudad,
        $mensaje,
        $forma_entrega,
        $metodo_pago
    );

    if ($stmt->execute()) {

        // GUARDAR EL PEDIDO CON LOS PRODUCTOS DEL CARRITO
        $id_contacto = $conn->insert_id;
        $carrito = json_decode($_POST['carrito'] ?? '[]', true) ?: [];

        $subtotal = 0;
        foreach ($carrito as $producto) {
            $subtotal += $producto['precio'] * $producto['cantidad'];
        }

        $domicilio = ($forma_entrega == "Envio") ? 5000 : 0;
        $total = $subtotal + $domicilio;

        $sqlPedido = "INSERT INTO pedido (id_contacto, fecha, subtotal, domicilio, total)
                      VALUES (?, NOW(), ?, ?, ?)";
        $stmtPedido = $conn->prepare($sqlPedido);

        if (!$stmtPedido) {
            echo json_encode([
                "success" => false,
                "message" => "No se pudo guardar el pedido. Revisa que exista la tabla pedido."
            ]);
            exit();
        }

        $stmtPedido->bind_param("iddd", $id_contacto, $subtotal, $domicilio, $total);
        $stmtPedido->execute();
        $id_pedido = $conn->insert_id;

        // Un registro por cada producto del carrito
        $sqlDetalle = "INSERT INTO detalle_pedido
                       (id_pedido, id_producto, nombre_producto, precio, cantidad, subtotal)
                       VALUES (?, ?, ?, ?, ?, ?)";
        $stmtDetalle = $conn->prepare($sqlDetalle);

        foreach ($carrito as $producto) {
            // Los productos de las páginas fijas (galletas, helados...) no tienen id en la base de datos
            $id_producto = is_numeric($producto['id_producto']) ? (int) $producto['id_producto'] : null;
            $nombre_producto = $producto['nombre'];
            $precio = $producto['precio'];
            $cantidad = (int) $producto['cantidad'];
            $subtotal_producto = $precio * $cantidad;

            $stmtDetalle->bind_param("iisdid", $id_pedido, $id_producto, $nombre_producto,
                                     $precio, $cantidad, $subtotal_producto);
            $stmtDetalle->execute();
        }

        echo json_encode([
            "success" => true,
            "message" => "Pedido guardado correctamente."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No fue posible guardar los datos."
        ]);
    }

    $stmt->close();
    $conn->close();

} else {
    echo json_encode([
        "success" => false,
        "message" => "Método de solicitud no permitido."
    ]);
}
?>

