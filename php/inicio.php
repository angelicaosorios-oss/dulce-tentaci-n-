
<?php
require("conexion.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $correo = $_POST['correo'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM usuarios WHERE correo = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {

        $usuario = $resultado->fetch_assoc();

        if (password_verify($password, $usuario['password'])) {

            session_start();

            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nombre'] = $usuario['nombre'];

            header("Location: ../html/index.html");
            exit();

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

