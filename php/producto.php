
<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = trim($_POST["nombre_producto"]);
    $descripcion = trim($_POST["descripcion"]);
    $precio = $_POST["precio"];
    $id_categoria = $_POST["id_categoria"];

    // Validar los datos
    if ($nombre == "" || $descripcion == "" || $precio <= 0 || $id_categoria <= 0) {
        header("Location: ../html/crearproductos.html?error=1");
        exit();
    }

    // Preparar la carpeta para las imágenes
    $carpeta = __DIR__ . "/../img/productos/";

    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0777, true);
    }

    // El modelo 3D (.glb) del producto es obligatorio
    if (!isset($_FILES["imagen"]) || $_FILES["imagen"]["error"] != 0) {
        header("Location: ../html/crearproductos.html?error=1");
        exit();
    }

    $temporal = $_FILES["imagen"]["tmp_name"];

    // Un modelo 3D .glb siempre empieza con los bytes "glTF"
    $esModelo3d = file_get_contents($temporal, false, null, 0, 4) === "glTF";

    if (!$esModelo3d || $_FILES["imagen"]["size"] > 20 * 1024 * 1024) {
        header("Location: ../html/crearproductos.html?error=1");
        exit();
    }

    $nombreModelo = uniqid("producto_") . ".glb";

    if (!move_uploaded_file($temporal, $carpeta . $nombreModelo)) {
        header("Location: ../html/crearproductos.html?error=1");
        exit();
    }

    $imagen = "../img/productos/" . $nombreModelo;

    // Guardar el producto en MySQL
    $sql = "INSERT INTO producto
            (nombre_producto, precio, id_categoria, descripcion, imagen)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param(
            "sdiss",
            $nombre,
            $precio,
            $id_categoria,
            $descripcion,
            $imagen
        );

        try {
            if ($stmt->execute()) {
                header("Location: ../html/crearproductos.html?registro=correcto");
                exit();
            }
        } catch (mysqli_sql_exception $e) {
            // por ejemplo: la categoría elegida ya no existe
        }
    }

    header("Location: ../html/crearproductos.html?error=1");
    exit();

} else {
    header("Location: ../html/crearproductos.html");
    exit();
}
?>
