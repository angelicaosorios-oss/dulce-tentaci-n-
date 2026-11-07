<?php
// Funciones compartidas por los archivos PHP del proyecto.

// ---------- RESPUESTAS JSON ----------
function responderJSON(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function responderError(string $mensaje, int $codigo = 400): void
{
    responderJSON(["success" => false, "message" => $mensaje], $codigo);
}

// ---------- SESIÓN ----------
function iniciarSesion(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function haySesion(): bool
{
    iniciarSesion();
    return isset($_SESSION["id_usuario"]);
}

// Para archivos que responden JSON (fetch desde JavaScript)
function requerirSesionJSON(): void
{
    if (!haySesion()) {
        responderError("Debes iniciar sesión para hacer esto.", 401);
    }
}

// Para archivos que reciben un formulario normal y redirigen
function requerirSesionRedireccion(): void
{
    if (!haySesion()) {
        header("Location: ../html/inicio.html?error=sesion");
        exit();
    }
}

// ---------- ARCHIVOS SUBIDOS (IMAGEN O MODELO 3D) ----------

const TIPOS_IMAGEN = [
    "image/jpeg" => ".jpg",
    "image/png"  => ".png",
    "image/webp" => ".webp",
    "image/gif"  => ".gif",
];
const MAX_IMAGEN_MB = 5;
const MAX_MODELO_MB = 25;

/**
 * Reconoce si el archivo es una imagen o un modelo 3D (.glb) mirando su
 * contenido real (no solo la extensión).
 * Devuelve "imagen", "modelo" o null si no es válido.
 */
function detectarTipoArchivo(string $rutaTemporal, string $nombreOriginal): ?string
{
    $mime = mime_content_type($rutaTemporal);

    if (isset(TIPOS_IMAGEN[$mime])) {
        return "imagen";
    }

    $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));

    if ($extension === "glb") {
        // Todo archivo .glb válido empieza con los 4 bytes "glTF"
        $inicio = file_get_contents($rutaTemporal, false, null, 0, 4);
        if ($inicio === "glTF") {
            return "modelo";
        }
    }

    return null;
}

/**
 * Guarda el archivo enviado en el campo $campo.
 *  - Imágenes  -> img/<subcarpeta>/
 *  - Modelos   -> modelos3d/<subcarpeta>/
 * Devuelve null si no se envió archivo, o ["ruta" => ..., "tipo" => ...].
 * Lanza RuntimeException con un mensaje para el usuario si algo falla.
 * La ruta devuelta es relativa a la carpeta html/ (ej: "../img/home/x.png").
 */
function guardarArchivoSubido(string $campo, string $subcarpeta): ?array
{
    if (!isset($_FILES[$campo]) || $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $archivo = $_FILES[$campo];

    if ($archivo["error"] === UPLOAD_ERR_INI_SIZE || $archivo["error"] === UPLOAD_ERR_FORM_SIZE) {
        throw new RuntimeException(
            "El archivo es demasiado grande para el servidor. "
            . "Aumenta upload_max_filesize y post_max_size en php.ini."
        );
    }

    if ($archivo["error"] !== UPLOAD_ERR_OK) {
        throw new RuntimeException("No se pudo subir el archivo (código " . $archivo["error"] . ").");
    }

    $tipo = detectarTipoArchivo($archivo["tmp_name"], $archivo["name"]);

    if ($tipo === null) {
        throw new RuntimeException("Formato no permitido. Usa una imagen (JPG, PNG, WEBP, GIF) o un modelo 3D .glb.");
    }

    $maximoMB = $tipo === "imagen" ? MAX_IMAGEN_MB : MAX_MODELO_MB;

    if ($archivo["size"] > $maximoMB * 1024 * 1024) {
        throw new RuntimeException("El archivo supera el máximo de {$maximoMB} MB.");
    }

    if ($tipo === "imagen") {
        $extension = TIPOS_IMAGEN[mime_content_type($archivo["tmp_name"])];
        $carpetaBase = "img";
    } else {
        $extension = ".glb";
        $carpetaBase = "modelos3d";
    }

    $carpeta = __DIR__ . "/../$carpetaBase/$subcarpeta/";

    if (!is_dir($carpeta) && !mkdir($carpeta, 0775, true)) {
        throw new RuntimeException("No se pudo crear la carpeta para guardar el archivo.");
    }

    $nombreArchivo = uniqid($subcarpeta . "_") . $extension;

    if (!move_uploaded_file($archivo["tmp_name"], $carpeta . $nombreArchivo)) {
        throw new RuntimeException("No se pudo guardar el archivo en el servidor.");
    }

    return [
        "ruta" => "../$carpetaBase/$subcarpeta/$nombreArchivo",
        "tipo" => $tipo,
    ];
}

/**
 * Borra un archivo que haya sido subido desde el administrador.
 * Solo borra dentro de las carpetas de subidas, nunca los modelos originales
 * ni URLs externas.
 */
function eliminarArchivoSubido(?string $ruta, string $subcarpeta): void
{
    if (!$ruta) {
        return;
    }

    foreach (["img", "modelos3d"] as $carpetaBase) {
        $prefijo = "../$carpetaBase/$subcarpeta/";

        if (strpos($ruta, $prefijo) === 0) {
            $nombre = basename($ruta);
            $rutaReal = __DIR__ . "/../$carpetaBase/$subcarpeta/" . $nombre;

            if (is_file($rutaReal)) {
                unlink($rutaReal);
            }
            return;
        }
    }
}

function textoPost(string $campo, int $maximo): string
{
    $valor = trim((string) ($_POST[$campo] ?? ""));

    // Si el texto no llega en UTF-8 (tildes o ñ mal codificadas), se corrige
    if (!mb_check_encoding($valor, "UTF-8")) {
        $valor = mb_convert_encoding($valor, "UTF-8", "Windows-1252");
    }

    return mb_substr($valor, 0, $maximo);
}

// En los archivos que responden JSON: cualquier error inesperado se devuelve
// como JSON (en vez de mostrar el error de PHP con rutas del servidor).
function activarErroresJSON(): void
{
    set_exception_handler(function (Throwable $e) {
        error_log($e->getMessage());
        responderError("Error del servidor. Inténtalo nuevamente.", 500);
    });
}
