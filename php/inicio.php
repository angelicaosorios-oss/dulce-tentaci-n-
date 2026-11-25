
<?php
require("conexion.php");

session_start();

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $correo = trim($_POST['correo'] ?? '');
    $password = $_POST['password'] ?? '';

    $sql = "SELECT id_usuario, nombre, correo, password, rol
            FROM usuarios
            WHERE correo = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {

        $usuario = $resultado->fetch_assoc();

        if (password_verify($password, $usuario['password'])) {

            session_regenerate_id(true);

            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['correo'] = $usuario['correo'];
            $_SESSION['rol'] = $usuario['rol'];

            if ($usuario['rol'] === 'administrador' &&
                $usuario['correo'] === 'administrador@midulcerincon.com') {

                header("Location: ../html/categoria.php");
                exit();

            } else {
                header("Location: ../html/index.php");

            }

        } else {
            header("Location: ../html/inicio.html?error=incorrecta");
            exit();
        }

    } else {
        header("Location: ../html/inicio.html?error=no_registrado");
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
