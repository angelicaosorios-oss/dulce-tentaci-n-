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
        echo json_encode([
            "success" => true,
            "message" => "Datos guardados correctamente."
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

