<?php
// Crea o actualiza la base de datos. Ábrelo una vez en el navegador:
// http://localhost/<tu-carpeta>/php/instalar.php
// Es seguro ejecutarlo varias veces: no borra datos.

require_once __DIR__ . "/config.php";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
header("Content-Type: text/html; charset=UTF-8");

$pasos = [];

try {
    // Conexión sin base de datos para poder crearla si no existe
    $conn = new mysqli(DB_SERVIDOR, DB_USUARIO, DB_PASSWORD);
    $conn->set_charset("utf8mb4");

    // 1. Ejecutar el script SQL (tablas nuevas + datos iniciales)
    $sql = file_get_contents(__DIR__ . "/../Bases_de_datos/mi_dulce_rincon.sql");
    $conn->multi_query($sql);

    do {
        if ($resultado = $conn->store_result()) {
            $resultado->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    $pasos[] = "Script SQL ejecutado (tablas creadas si no existían).";

    $conn->select_db(DB_NOMBRE);

    // 2. Agregar columnas nuevas a tablas que ya existían de antes
    $columnas = [
        ["categoria", "imagen", "VARCHAR(500) NULL"],
        ["categoria", "tipo_media", "ENUM('imagen','modelo') NULL"],
        ["producto", "descripcion", "TEXT NULL"],
        ["producto", "imagen", "VARCHAR(500) NULL"],
        ["producto", "tipo_media", "ENUM('imagen','modelo') NULL"],
    ];

    $consulta = $conn->prepare(
        "SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?"
    );

    foreach ($columnas as [$tabla, $columna, $definicion]) {
        $baseDatos = DB_NOMBRE;
        $consulta->bind_param("sss", $baseDatos, $tabla, $columna);
        $consulta->execute();
        $existe = $consulta->get_result()->fetch_row()[0] > 0;

        if (!$existe) {
            $conn->query("ALTER TABLE `$tabla` ADD COLUMN `$columna` $definicion");
            $pasos[] = "Columna agregada: $tabla.$columna";
        }
    }

    // 3. Pasar las tablas a utf8mb4 (tildes, ñ y emojis) si estaban en otro formato
    $tablas = $conn->prepare(
        "SELECT TABLE_NAME FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_COLLATION NOT LIKE 'utf8mb4%'"
    );
    $baseDatos = DB_NOMBRE;
    $tablas->bind_param("s", $baseDatos);
    $tablas->execute();

    foreach ($tablas->get_result()->fetch_all() as [$tabla]) {
        $conn->query("ALTER TABLE `$tabla` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pasos[] = "Tabla convertida a utf8mb4: $tabla";
    }

    // 4. Marcar como imagen los productos viejos que ya tenían imagen
    $conn->query("UPDATE producto SET tipo_media = 'imagen'
                  WHERE imagen IS NOT NULL AND tipo_media IS NULL");

    $pasos[] = "¡Listo! La base de datos está actualizada.";
    $ok = true;
} catch (mysqli_sql_exception $e) {
    $pasos[] = "Error: " . $e->getMessage();
    $ok = false;
}
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Instalar base de datos</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8e8ed; padding: 40px; color: #5c4033; }
        .caja { background: white; max-width: 600px; margin: auto; padding: 30px; border-radius: 14px; }
        li { margin: 8px 0; }
        .ok { color: #2e7d32; } .error { color: #c62828; }
        a { color: #c8757a; }
    </style>
</head>
<body>
    <div class="caja">
        <h1 class="<?= $ok ? "ok" : "error" ?>"><?= $ok ? "✅ Base de datos lista" : "⚠️ Hubo un problema" ?></h1>
        <ul>
            <?php foreach ($pasos as $paso): ?>
                <li><?= htmlspecialchars($paso) ?></li>
            <?php endforeach; ?>
        </ul>
        <p><a href="../html/inicio.html">Ir a iniciar sesión</a></p>
    </div>
</body>
</html>
