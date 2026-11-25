
<?php
require("conexion.php");

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre_cliente = trim($_POST["nombre"] ?? "");
    $telefono = trim($_POST["telefono"] ?? "");
    $correo = trim($_POST["correo"] ?? "");
    $total = floatval($_POST["total"] ?? 0);
    $productos = json_decode($_POST["productos"] ?? "[]", true);

    if ($nombre_cliente == "" || $telefono == "" || $correo == "" || $total <= 0 ||
        !is_array($productos) || count($productos) == 0) {

        echo json_encode([
            "success" => false,
            "message" => "Faltan datos del pedido."
        ]);
        exit();
    }

    try {

        $conn->begin_transaction();

        // GUARDAR EL CLIENTE (tabla cliente) Y OBTENER SU id_cliente
        $sqlCliente = "INSERT INTO cliente (nombre, telefono, correo)
                       VALUES (?, ?, ?)";

        $stmtCliente = $conn->prepare($sqlCliente);
        $stmtCliente->bind_param("sss", $nombre_cliente, $telefono, $correo);
        $stmtCliente->execute();

        $id_cliente = $conn->insert_id;

        $stmtCliente->close();

        // GUARDAR EL PEDIDO
        $sql = "INSERT INTO pedido (total, id_cliente)
                VALUES (?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("di", $total, $id_cliente);
        $stmt->execute();

        $id_pedido = $conn->insert_id;

        $stmt->close();

        // GUARDAR LOS PRODUCTOS COMPRADOS
        $sqlDetalle = "INSERT INTO detalle_pedido
        (id_pedido, nombre_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)";

        $detalle = $conn->prepare($sqlDetalle);

        foreach ($productos as $producto) {

            $nombre = $producto["nombre"];
            $cantidad = intval($producto["cantidad"]);
            $precio = floatval($producto["precio"]);
            $subtotal = $cantidad * $precio;

            if ($cantidad <= 0 || $precio < 0 || empty($nombre)) {
                throw new Exception("Producto inválido.");
            }

            $detalle->bind_param(
                "isidd",
                $id_pedido,
                $nombre,
                $cantidad,
                $precio,
                $subtotal
            );

            $detalle->execute();
        }

        $detalle->close();

        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Pedido y productos guardados correctamente.",
            "id_pedido" => $id_pedido
        ]);

    } catch (Exception $e) {

        $conn->rollback();

        echo json_encode([
            "success" => false,
            "message" => "Error al guardar el pedido: " . $e->getMessage()
        ]);
    }

    $conn->close();

} else {

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ]);
}
?>

