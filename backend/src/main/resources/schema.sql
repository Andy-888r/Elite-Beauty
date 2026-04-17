-- =============================================
-- SCRIPT SQL: Organice Beauty
-- Base de datos para Amazon RDS (MySQL)
-- =============================================

CREATE DATABASE IF NOT EXISTS db_belleza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_belleza;

-- =============================================
-- TABLA: administradores
-- =============================================
CREATE TABLE IF NOT EXISTS administradores (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    usuario    VARCHAR(50)  NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    correo     VARCHAR(100),
    activo     BOOLEAN DEFAULT TRUE,
    superadmin BOOLEAN DEFAULT FALSE
);

-- Admin por defecto (contraseña encriptada con BCrypt en producción)
INSERT IGNORE INTO administradores (nombre, usuario, contrasena, correo, activo, superadmin)
VALUES ('Administrador Principal', 'admin', 'admin123', 'admin@organice.com', 1, 1);
-- Contraseña en texto plano: admin123 (cambiar al desplegar)

-- ============================================= 
-- TABLA: clientes
-- =============================================
CREATE TABLE IF NOT EXISTS clientes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario         VARCHAR(50)  NOT NULL UNIQUE,
    contrasena      VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    telefono        VARCHAR(20),
    correo          VARCHAR(100),
    direccion       VARCHAR(200),
    preferencias    TEXT
);

-- =============================================
-- TABLA: proveedores
-- =============================================
CREATE TABLE IF NOT EXISTS proveedores (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    rfc        VARCHAR(20)  UNIQUE,
    usuario    VARCHAR(50)  NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    empresa    VARCHAR(100),
    telefono   VARCHAR(20),
    correo     VARCHAR(100),
    direccion  VARCHAR(200),
    activo     BOOLEAN DEFAULT TRUE
);

-- =============================================
-- TABLA: categorias
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

INSERT IGNORE INTO categorias (nombre) VALUES
    ('Maquillaje'), ('Cuidado de piel'), ('Cabello'), ('Fragancias'),
    ('Uñas'), ('Cuerpo'), ('Accesorios'), ('Otros');

-- =============================================
-- TABLA: productos
-- =============================================
CREATE TABLE IF NOT EXISTS productos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    marca       VARCHAR(100),
    categoria   VARCHAR(100),
    descripcion TEXT,
    imagen_path VARCHAR(500),  -- URL de S3
    precio      DECIMAL(10,2) DEFAULT 0.00,
    activo      BOOLEAN DEFAULT FALSE
);

-- =============================================
-- TABLA: inventario
-- =============================================
CREATE TABLE IF NOT EXISTS inventario (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL UNIQUE,
    stock       INT DEFAULT 0,
    minimo      INT DEFAULT 5,
    estado      VARCHAR(20) DEFAULT 'SIN STOCK',
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: proveedor_producto (relación N:M)
-- =============================================
CREATE TABLE IF NOT EXISTS proveedor_producto (
    id_proveedor INT NOT NULL,
    id_producto  INT NOT NULL,
    precio       DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (id_proveedor, id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto)  REFERENCES productos(id)  ON DELETE CASCADE
);

-- =============================================
-- TABLA: solicitudes_entrada
-- =============================================
CREATE TABLE IF NOT EXISTS solicitudes_entrada (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_producto  INT NOT NULL,
    cantidad     INT NOT NULL,
    fecha        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado       VARCHAR(30) DEFAULT 'Pendiente',
    motivo       VARCHAR(255),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id),
    FOREIGN KEY (id_producto)  REFERENCES productos(id)
);

-- =============================================
-- TABLA: ordenes_compra
-- =============================================
CREATE TABLE IF NOT EXISTS ordenes_compra (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    fecha        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado       VARCHAR(30) DEFAULT 'GUARDADA',
    total        DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

-- =============================================
-- TABLA: detalles_orden
-- =============================================
CREATE TABLE IF NOT EXISTS detalles_orden (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_orden    INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad    INT NOT NULL,
    precio      DECIMAL(10,2),
    FOREIGN KEY (id_orden)    REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- =============================================
-- TABLA: historial_compras (ventas a clientes)
-- =============================================
CREATE TABLE IF NOT EXISTS historial_compras (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente   INT,
    id_producto  INT NOT NULL,
    id_proveedor INT,
    cantidad     INT NOT NULL,
    total        DECIMAL(10,2),
    fecha        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente)   REFERENCES clientes(id),
    FOREIGN KEY (id_producto)  REFERENCES productos(id),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

-- =============================================
-- TABLA: historial_movimientos (inventario)
-- =============================================
CREATE TABLE IF NOT EXISTS historial_movimientos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo        VARCHAR(20) NOT NULL,
    cantidad    INT NOT NULL,
    motivo      VARCHAR(255),
    fecha       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);
CREATE TABLE IF NOT EXISTS banner_productos (
    banner_id   INT NOT NULL,
    producto_id INT NOT NULL,
    PRIMARY KEY (banner_id, producto_id),
    FOREIGN KEY (banner_id)   REFERENCES banners(id)   ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
