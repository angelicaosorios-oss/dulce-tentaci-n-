-- =====================================================
-- BASE DE DATOS: MI DULCE RINCÓN  (MySQL / MariaDB - XAMPP)
-- Se puede ejecutar varias veces sin borrar datos.
-- Forma fácil: abre http://localhost/<tu-carpeta>/php/instalar.php
-- =====================================================

CREATE DATABASE IF NOT EXISTS mi_dulce_rincon
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mi_dulce_rincon;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

-- imagen: ruta de la imagen o del modelo 3D (.glb)
-- tipo_media: 'imagen' o 'modelo'
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    imagen VARCHAR(500) NULL,
    tipo_media ENUM('imagen', 'modelo') NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    id_categoria INT NOT NULL,
    imagen VARCHAR(500) NULL,
    tipo_media ENUM('imagen', 'modelo') NULL,
    CONSTRAINT FK_Producto_Categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    id_cliente INT NOT NULL,
    CONSTRAINT FK_Pedido_Cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_Detalle_Pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido),
    CONSTRAINT FK_Detalle_Producto FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS contacto (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL,
    novedades TINYINT(1) DEFAULT 0,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    mensaje TEXT,
    forma_entrega VARCHAR(30) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4;

-- ===== CONTENIDO DEL HOME (se edita en "Administrar home") =====

-- Las 3 tarjetas de "Productos destacados" (posicion 1, 2 y 3)
CREATE TABLE IF NOT EXISTS destacado (
    posicion TINYINT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL DEFAULT '',
    archivo VARCHAR(500) NOT NULL,
    tipo_media ENUM('imagen', 'modelo') NOT NULL DEFAULT 'imagen',
    texto_alt VARCHAR(150) NOT NULL DEFAULT '',
    auto_rotar TINYINT(1) NOT NULL DEFAULT 1
) DEFAULT CHARSET = utf8mb4;

-- Diapositivas del carrusel (banner principal)
CREATE TABLE IF NOT EXISTS carrusel (
    id_carrusel INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL DEFAULT '',
    descripcion VARCHAR(255) NOT NULL DEFAULT '',
    archivo VARCHAR(500) NOT NULL,
    tipo_media ENUM('imagen', 'modelo') NOT NULL DEFAULT 'imagen',
    texto_alt VARCHAR(150) NOT NULL DEFAULT '',
    auto_rotar TINYINT(1) NOT NULL DEFAULT 1,
    orden INT NOT NULL DEFAULT 0
) DEFAULT CHARSET = utf8mb4;

-- Datos iniciales (solo se insertan si todavía no existen)
INSERT IGNORE INTO destacado (posicion, titulo, descripcion, archivo, tipo_media, texto_alt) VALUES
(1, 'Deliciosos postres', 'Los favoritos de nuestros clientes',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', 'imagen', 'Torta de chocolate'),
(2, 'Galletas especiales', 'Perfectas para cualquier ocasión',
    '../modelos3d/galleta-chocolate.glb', 'modelo', 'Galleta de chocolate en 3D'),
(3, 'Promociones', 'Disfruta nuestras ofertas',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80', 'imagen', 'Cupcakes');

INSERT INTO carrusel (titulo, descripcion, archivo, tipo_media, texto_alt, orden)
SELECT * FROM (
    SELECT '' AS titulo, '' AS descripcion,
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80' AS archivo,
        'imagen' AS tipo_media, 'Torta' AS texto_alt, 1 AS orden
    UNION ALL SELECT '', '',
        'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
        'imagen', 'Cupcakes', 2
) AS iniciales
WHERE NOT EXISTS (SELECT 1 FROM carrusel);
