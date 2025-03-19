-- Insertar usuarios de prueba
INSERT INTO usuarios (rif_cedula, nombre, direccion, registro_mercantil, volumen_compra, correo, telefono, created_at, updated_at)
VALUES
    ('J123456789', 'Juan Pérez', 'Av Principal 123', '', 0, 'juan@example.com', '04121234567', NOW(), NOW()),
    ('M987654321', 'María García', 'Calle Secundaria 456', '', 1, 'maria@example.com', '04261234568', NOW(), NOW()),
    ('G555555555', 'Gabriel Rodríguez', 'Av Comercial 789', '', 2, 'gabriel@example.com', '04141234569', NOW(), NOW());

-- Insertar precios de prueba
INSERT INTO precio (codigo_precio, nombre_precio, precio_unidad, created_at, updated_at)
VALUES
    (100, 'Precio Básico',27.99, NOW(), NOW()),
    (101, 'Precio Premium', 115.99, NOW(), NOW()),
    (102, 'Precio Elite', 32.99, NOW(), NOW());

-- Insertar productos de prueba
INSERT INTO producto (codigo, nombre, descripcion, presentacion, cantidad, created_at, updated_at)
VALUES
    ('PROD001', 'Producto A', 'Descripción del Producto A', '2kg', 100, NOW(), NOW()),
    ('PROD002', 'Producto B', 'Descripción del Producto B', '12kg', 50, NOW(), NOW()),
    ('PROD003', 'Producto C', 'Descripción del Producto C', '1kg', 75, NOW(), NOW());

-- Insertar relaciones precio_usuario
INSERT INTO precio_usuario (usuario_id, precio_id, created_at, updated_at)
VALUES
    (1, 1, NOW(), NOW()), -- Juan: Precio Básico
    (2, 2, NOW(), NOW()), -- María: Precio Premium
    (3, 3, NOW(), NOW()); -- Gabriel: Precio Elite

-- Insertar pagos de prueba
INSERT INTO pagos (precio_usuario_id, producto_id, fecha, referencia, numero_referencia, monto, created_at, updated_at)
VALUES
    (1, 1, NOW(), 'INV001', 'REF123', 99.99, NOW(), NOW()),
    (2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 'INV002', 'REF124', 149.99, NOW(), NOW()),
    (3, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'INV003', 'REF125', 249.99, NOW(), NOW());