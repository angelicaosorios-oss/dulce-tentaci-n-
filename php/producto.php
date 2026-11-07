<?php
// Crear producto desde html/crearproductos.html
// Acepta imagen (JPG, PNG, WEBP, GIF) o modelo 3D (.glb); el tipo se reconoce solo.
require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/utilidades.php";

function volver(string $parametros): void
{
    header("Location: ../html/crearproductos.html?" . $parametros);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../html/crearproductos.html");
    exit();
}

requerirSesionRedireccion();

$nombre = textoPost("nombre_producto", 100);
$descripcion = textoPost("descripcion", 2000);
$precio = (float) ($_POST["precio"] ?? 0);
$idCategoria = (int) ($_POST["id_categoria"] ?? 0);

if ($nombre === "" || $descripcion === "" || $precio <= 0 || $idCategoria <= 0) {
    volver("error=1");
}

try {
    $archivo = guardarArchivoSubido("imagen", "productos");
} catch (RuntimeException $e) {
    volver("error=archivo&detalle=" . urlencode($e->getMessage()));
}

$ruta = $archivo["ruta"] ?? null;
$tipo = $archivo["tipo"] ?? null;

try {
    $stmt = $conn->prepare(
        "INSERT INTO producto (nombre_producto, precio, id_categoria, descripcion, imagen, tipo_media)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sdisss", $nombre, $precio, $idCategoria, $descripcion, $ruta, $tipo);
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    eliminarArchivoSubido($ruta, "productos");
    volver("error=1");
}

volver("registro=correcto");
