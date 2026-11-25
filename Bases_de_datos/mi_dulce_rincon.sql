-- Base de datos de Mi Dulce Rincón (MySQL / MariaDB - XAMPP)
-- Importar en phpMyAdmin: pestaña "Importar" -> seleccionar este archivo -> "Importar".
-- Desde consola: mysql -u root --default-character-set=utf8mb4 < mi_dulce_rincon.sql

CREATE DATABASE IF NOT EXISTS mi_dulce_rincon
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE mi_dulce_rincon;

-- Usuarios que inician sesión (php/registro.php, php/inicio.php)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    correo     VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Categorías de productos (php/categoria.php, php/listar_categoria.php)
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    imagen           VARCHAR(255)          -- foto JPG/PNG de la categoría
) ENGINE=InnoDB;

-- Si la tabla ya existía sin la columna de imagen, se agrega
ALTER TABLE categoria ADD COLUMN IF NOT EXISTS imagen VARCHAR(255);

-- Productos (php/producto.php)
CREATE TABLE IF NOT EXISTS producto (
    id_producto     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    sabor           VARCHAR(50),
    precio          DECIMAL(10, 2) NOT NULL,
    id_categoria    INT NOT NULL,
    descripcion     TEXT,
    imagen          VARCHAR(255),          -- modelo 3D .glb del producto
    CONSTRAINT FK_Producto_Categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
) ENGINE=InnoDB;

-- Si la tabla ya existía de una versión anterior, se agregan las columnas nuevas
ALTER TABLE producto ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE producto ADD COLUMN IF NOT EXISTS imagen VARCHAR(255);

-- Clientes
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    telefono   VARCHAR(20)  NOT NULL,
    correo     VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Pedidos
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido  INT AUTO_INCREMENT PRIMARY KEY,
    fecha      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total      DECIMAL(10, 2) NOT NULL,
    id_cliente INT NOT NULL,
    CONSTRAINT FK_Pedido_Cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
) ENGINE=InnoDB;

-- Detalle de cada pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle  INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido   INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad    INT NOT NULL,
    subtotal    DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_Detalle_Pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido),
    CONSTRAINT FK_Detalle_Producto FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
) ENGINE=InnoDB;

-- Datos del formulario de contacto / pedido (php/contacto.php)
CREATE TABLE IF NOT EXISTS contacto (
    id_contacto        INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL,
    novedades          TINYINT(1) DEFAULT 0,
    nombre             VARCHAR(100) NOT NULL,
    apellidos          VARCHAR(100) NOT NULL,
    telefono           VARCHAR(20)  NOT NULL,
    direccion          VARCHAR(150) NOT NULL,
    ciudad             VARCHAR(100) NOT NULL,
    mensaje            TEXT,
    forma_entrega      VARCHAR(30)  NOT NULL,
    metodo_pago        VARCHAR(50)  NOT NULL,
    fecha_registro     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS INICIALES: categorías y productos de la tienda
-- (solo se insertan si todavía no existen, se puede importar varias veces)
-- =====================================================================

INSERT INTO categoria (nombre_categoria)
SELECT n FROM (
    SELECT 'Malteadas' AS n UNION ALL SELECT 'Cupcakes' UNION ALL
    SELECT 'Galletas' UNION ALL SELECT 'Cheesecakes' UNION ALL SELECT 'Helados'
) AS nuevas
WHERE n NOT IN (SELECT nombre_categoria FROM categoria);

INSERT INTO producto (nombre_producto, sabor, precio, id_categoria, descripcion, imagen)
SELECT d.nombre, d.sabor, d.precio, c.id_categoria, d.descripcion, d.imagen
FROM (
    SELECT 'Malteada de Chocolate' AS nombre, 'Chocolate' AS sabor, 10000 AS precio, 'Malteadas' AS categoria,
           'Deliciosa malteada de chocolate, cremosa y llena de sabor con pequeños trozos de chocolate.' AS descripcion,
           '../modelos3d/malteada_chocolate.glb' AS imagen
    UNION ALL SELECT 'Malteada de Oreo', 'Oreo', 11000, 'Malteadas',
           'Una malteada cremosa con el delicioso sabor de las galletas Oreo con pequeños trozos de galleta que le da un toque más dulce.',
           '../modelos3d/malteada_oreo.glb'
    UNION ALL SELECT 'Malteada de Fresa', 'Fresa', 10000, 'Malteadas',
           'Suave y refrescante malteada de fresa con un sabor delicioso y con pequeños trozos de fresa.',
           '../modelos3d/malteda-fresa.glb'

    UNION ALL SELECT 'Cupcake de Chocolate', 'Chocolate', 5000, 'Cupcakes',
           'Suave y esponjoso, con un delicioso sabor a chocolate y una cremosa decoración.',
           '../modelos3d/oreo_cupcake.glb'
    UNION ALL SELECT 'Cupcake de Vainilla', 'Vainilla', 4500, 'Cupcakes',
           'Clásico, ligero y esponjoso, con un delicado sabor a vainilla con crema dulce.',
           '../modelos3d/cupcake -vainilla.glb'
    UNION ALL SELECT 'Cupcake de Fresa', 'Fresa', 5000, 'Cupcakes',
           'Dulce y suave, preparado con sabor a fresa y cubierto con una deliciosa crema.',
           '../modelos3d/cupcake-fresa.glb'

    UNION ALL SELECT 'Galleta de Chocolate', 'Chocolate', 5000, 'Galletas',
           'Galleta suave con deliciosos trozos de chocolate.',
           '../modelos3d/galleta-chocolate.glb'
    UNION ALL SELECT 'Galleta Muñeco de Jengibre', 'Jengibre', 5500, 'Galletas',
           'Galleta de jengibre navideña hecha para comer en cualquier momento sin tener que ser un día especial, con un muy rico sabor.',
           '../modelos3d/galleta-muñeco-de-jengibre.glb'
    UNION ALL SELECT 'Galleta Oreo', 'Oreo', 5000, 'Galletas',
           'Deliciosa galleta con sabor a Oreo, perfecta para los amantes del chocolate.',
           '../modelos3d/galleta-oreo.glb'

    UNION ALL SELECT 'Cheesecake de Fresa', 'Fresa', 12000, 'Cheesecakes',
           'Cremoso cheesecake con dulce sabor a fresa y una deliciosa cobertura.',
           '../modelos3d/cheesecake-fresa.glb'
    UNION ALL SELECT 'Cheesecake de Maracuyá', 'Maracuyá', 12500, 'Cheesecakes',
           'Suave cheesecake con el delicioso toque dulce y ácido del maracuyá.',
           '../modelos3d/cheesecake-maracuya.glb'
    UNION ALL SELECT 'Cheesecake de Oreo', 'Oreo', 13000, 'Cheesecakes',
           'Cremoso cheesecake acompañado de galletas Oreo para los amantes del chocolate.',
           '../modelos3d/cheesecake-oreo.glb'

    UNION ALL SELECT 'Helado de Chocolate', 'Chocolate', 6000, 'Helados',
           'Cremoso helado de chocolate con un delicioso sabor intenso y dulce.',
           '../modelos3d/helado-chocolate.glb'
    UNION ALL SELECT 'Helado de Fresa', 'Fresa', 6000, 'Helados',
           'Refrescante helado de fresa, suave y lleno de sabor.',
           '../modelos3d/helado-fresa.glb'
    UNION ALL SELECT 'Helado de Vainilla', 'Vainilla', 5500, 'Helados',
           'Clásico helado de vainilla, cremoso, suave y delicioso.',
           '../modelos3d/helado-vainilla.glb'
) AS d
JOIN categoria c ON c.nombre_categoria = d.categoria
WHERE d.nombre NOT IN (SELECT nombre_producto FROM producto)
ORDER BY FIELD(d.nombre,
    'Malteada de Chocolate', 'Malteada de Oreo', 'Malteada de Fresa',
    'Cupcake de Chocolate', 'Cupcake de Vainilla', 'Cupcake de Fresa',
    'Galleta de Chocolate', 'Galleta Muñeco de Jengibre', 'Galleta Oreo',
    'Cheesecake de Fresa', 'Cheesecake de Maracuyá', 'Cheesecake de Oreo',
    'Helado de Chocolate', 'Helado de Fresa', 'Helado de Vainilla');
