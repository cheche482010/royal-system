-- Insertar datos de prueba en la tabla usuarios
INSERT INTO usuarios (documento, documento_img, nombre, direccion, registro_mercantil_img, correo, telefono, user_password, role, token) VALUES
('V-12345678', '/uploads/user/doc1.jpg', 'Juan Pérez', 'Calle Principal 123, Caracas', '/images/registros/reg1.jpg', 'juan@example.com', '+584141234567', '$2a$10$abcdefghijklmnopqrstuv', 'Admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
('J-87654321', '/uploads/user/doc2.jpg', 'María Rodríguez', 'Avenida Libertador 456, Maracaibo', '/images/registros/reg2.jpg', 'maria@example.com', '+584261234567', '$2a$10$vwxyzabcdefghijklmnopq', 'Employee', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0'),
('V-98765432', '/uploads/user/doc3.jpg', 'Carlos Gómez', 'Urbanización El Paraíso 789, Valencia', '/images/registros/reg3.jpg', 'carlos@example.com', '+584161234567', '$2a$10$rstuvwxyzabcdefghijklm', 'Customer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1');

-- Insertar datos de prueba en la tabla sesiones
INSERT INTO sesiones (usuario_id, token, ip, expiracion, agente_usuario) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session1', '192.168.1.1', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session2', '192.168.1.2', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session3', '192.168.1.3', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)');

-- Insertar datos de prueba en la tabla categorias
INSERT INTO categorias (nombre, codigo) VALUES
('Electrónicos', 'CAT001'),
('Ropa', 'CAT002'),
('Hogar', 'CAT003');

-- Insertar datos de prueba en la tabla marcas
INSERT INTO marcas (nombre, descripcion, logo_img) VALUES
('Samsung', 'Empresa multinacional de tecnología', '/images/logos/samsung.png'),
('Adidas', 'Marca de ropa deportiva', '/images/logos/adidas.png'),
('IKEA', 'Empresa de muebles y artículos para el hogar', '/images/logos/ikea.png');

-- Insertar datos de prueba en la tabla inventario (sin producto_id inicialmente)
INSERT INTO inventario (cantidad_inicial, cantidad_actual, lote, estado, fecha_ingreso) VALUES
(100, 95, 'LOT001', 'Disponible', '2023-01-15'),
(50, 48, 'LOT002', 'Disponible', '2023-02-20'),
(75, 75, 'LOT003', 'Disponible', '2023-03-10');

-- Insertar datos de prueba en la tabla productos
INSERT INTO productos (codigo, nombre, descripcion, producto_img, precio_unidad, precio_tienda, precio_distribuidor, inventario_id, marca_id, categoria_id) VALUES
('PROD001', 'Smartphone Galaxy S21', 'Teléfono inteligente con pantalla AMOLED de 6.2 pulgadas', '/images/productos/galaxy-s21.jpg', 799.99, 749.99, 699.99, 1, 1, 1),
('PROD002', 'Camiseta Deportiva', 'Camiseta deportiva de algodón transpirable', '/images/productos/camiseta-adidas.jpg', 29.99, 24.99, 19.99, 2, 2, 2),
('PROD003', 'Mesa de Centro', 'Mesa de centro de madera para sala de estar', '/images/productos/mesa-ikea.jpg', 149.99, 129.99, 109.99, 3, 3, 3);

-- Actualizar la tabla inventario para agregar producto_id
UPDATE inventario SET producto_id = 1 WHERE id = 1;
UPDATE inventario SET producto_id = 2 WHERE id = 2;
UPDATE inventario SET producto_id = 3 WHERE id = 3;

-- Insertar datos de prueba en la tabla historial_precios
INSERT INTO historial_precios (producto_id, precio_unidad, precio_tienda, precio_distribuidor, fecha_update) VALUES
(1, 849.99, 799.99, 749.99, '2022-12-01'),
(2, 34.99, 29.99, 24.99, '2022-11-15'),
(3, 169.99, 149.99, 129.99, '2022-10-20');

-- Insertar datos de prueba en la tabla carrito
INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES
(3, 1, 1),
(3, 2, 2),
(2, 3, 1);

-- Insertar datos de prueba en la tabla ordenes
INSERT INTO ordenes (usuario_id, monto_total, status) VALUES
(3, 859.97, 'Completa'),
(2, 149.99, 'Pendiente'),
(1, 29.99, 'Completa');

-- Insertar datos de prueba en la tabla detalles_orden
INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio) VALUES
(1, 1, 1, 799.99),
(1, 2, 2, 29.99),
(2, 3, 1, 149.99),
(3, 2, 1, 29.99);

-- Insertar datos de prueba en la tabla metodos_pago
INSERT INTO metodos_pago (nombre, descripcion) VALUES
('Transferencia Bancaria', 'Pago mediante transferencia a cuenta bancaria'),
('Pago Móvil', 'Pago mediante aplicación de pago móvil'),
('Efectivo', 'Pago en efectivo al momento de la entrega');

-- Insertar datos de prueba en la tabla pagos
INSERT INTO pagos (orden_id, metodo_pago_id, fecha, comprobante_img, numero_referencia, monto) VALUES
(1, 1, '2023-04-15 10:30:00', '/images/comprobantes/comp1.jpg', '123456', 859.97),
(2, 2, '2023-04-16 14:45:00', '/images/comprobantes/comp2.jpg', '654321', 149.99),
(3, 3, '2023-04-17 16:20:00', '/images/comprobantes/comp3.jpg', NULL, 29.99);

-- Insertar datos de prueba en la tabla facturas
INSERT INTO facturas (orden_id, numero_factura, fecha_emision, subtotal) VALUES
(1, 'FAC-2023-001', '2023-04-15', 859.97),
(2, 'FAC-2023-002', '2023-04-16', 149.99),
(3, 'FAC-2023-003', '2023-04-17', 29.99);

-- Insertar datos de prueba en la tabla bitacora
INSERT INTO bitacora (usuario_id, fecha, hora, accion) VALUES
(1, '2023-04-15', '10:35:00', 'Creación de producto PROD001'),
(2, '2023-04-16', '14:50:00', 'Actualización de inventario para producto PROD002'),
(3, '2023-04-17', '16:25:00', 'Realización de compra, orden #3');

-- Insertar datos de prueba en la tabla dolar_bcv
INSERT INTO dolar_bcv (tasa_cambio, fecha_inicio, fecha_fin) VALUES
(35.8765, '2023-04-01 00:00:00', '2023-04-07 23:59:59'),
(36.1234, '2023-04-08 00:00:00', '2023-04-14 23:59:59'),
(36.4321, '2023-04-15 00:00:00', NULL);