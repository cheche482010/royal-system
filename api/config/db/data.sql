-- Insertar datos de prueba en la tabla usuarios
INSERT INTO usuarios (documento, documento_img, nombre, direccion, registro_mercantil_img, correo, telefono, user_password, role, token) VALUES
('V-12345678', '/uploads/user/doc1.jpg', 'Juan Pérez', 'Calle Principal 123, Caracas', '/uploads/user/reg1.jpg', 'juan@example.com', '+584141234567', '$2a$10$abcdefghijklmnopqrstuv', 'Admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
('J-87654321', '/uploads/user/doc2.jpg', 'María Rodríguez', 'Avenida Libertador 456, Maracaibo', '/uploads/user/reg2.jpg', 'maria@example.com', '+584261234567', '$2a$10$vwxyzabcdefghijklmnopq', 'Employee', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0'),
('V-98765432', '/uploads/user/doc3.jpg', 'Carlos Gómez', 'Urbanización El Paraíso 789, Valencia', '/uploads/user/reg3.jpg', 'carlos@example.com', '+584161234567', '$2a$10$rstuvwxyzabcdefghijklm', 'Customer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1');

-- Insertar datos de prueba en la tabla sesiones
INSERT INTO sesiones (usuario_id, token, ip, expiracion, agente_usuario) VALUES
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session3', '192.168.1.3', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)');

-- Insertar datos de prueba en la tabla categorias
INSERT INTO categorias (nombre, codigo) VALUES
('Alimento para Gatos', 'CAT001'),
('Alimento para Perros', 'CAT002'),
('Alimento para Aves', 'CAT003');

-- Insertar datos de prueba en la tabla marcas
INSERT INTO marcas (nombre, descripcion, logo_img) VALUES
('BRIT', 'Marca de alimentos para mascotas', '/uploads/brands/brit.png'),
('Royal Canin', 'Marca premium de alimentos para mascotas', '/uploads/brands/royal.png'),
('Purina', 'Marca de alimentos para mascotas variados', '/uploads/brands/purina.png'),
('Hills', 'Marca especializada en dietas veterinarias', '/uploads/brands/hills.png');

-- Insertar datos de prueba en la tabla inventario (sin producto_id inicialmente)
INSERT INTO inventario (cantidad_inicial, cantidad_actual, lote, estado, fecha_ingreso) VALUES
(1000, 1000, 'HYPO2KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'GASTRO-2KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'HEPATIC-2KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'RENAL-2KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'STRUVITE-2KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'GASTRO-12KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'HYPO-12KG', 'Disponible', '2025-04-01'),
(1000, 1000, 'RENAL-12KG', 'Disponible', '2025-04-01');

-- Insertar datos de prueba en la tabla productos
-- Nota: Ahora usando marca_id = 1 (BRIT) en lugar de 4, y categoria_id = 2 (Alimento para Perros) en lugar de 4
INSERT INTO productos (codigo, nombre, descripcion, producto_img, precio_unidad, precio_tienda, precio_distribuidor, inventario_id, marca_id, categoria_id) VALUES
('RP001', 'BRIT DIETA BETERINARIA HYPOALLERGENIC 2KG', 'Alimento balanceado hipoalergénico completo para perros con problemas dermatológicos y gastrointestinales', '/uploads/products/2 kg/hypo 2kg.jpg', 32.00, 28.00, 22.00, 1, 1, 2),
('RP002', 'BRIT DIETA BETERINARIA GASTROINTESTINAL 2KG', 'Alimento Balanceado completo para perros con desordenes gastrointestinales','/uploads/products/2 kg/gastro 2kg.jpg', 32.00, 28.00, 22.00, 2, 1, 2),
('RP003', 'BRIT DIETA BETERINARIA HEPATIC 2KG', 'Alimento balanceado completo para perros con funciones hepáticas dañadas','/uploads/products/2 kg/hepatic 2kg.jpg', 32.00, 28.00, 22.00, 3, 1, 2),
('RP004', 'BRIT DIETA BETERINARIA RENAL 2KG', 'Alimento balanceado completo para perros con funciones renales dañados','/uploads/products/2 kg/renal 2kg.jpg', 32.00, 28.00, 22.00, 4, 1, 2),
('RP005', 'BRIT DIETA BETERINARIA STRUVITE 2KG', 'Alimento Balanceado completo para control de perros con enfermedades de tracto urinario inferior','/uploads/products/2 kg/struvite 2kg.jpg', 32.00, 28.00, 22.00, 5, 1, 2),
('RP006', 'BRIT DIETA BETERINARIA GASTROINTESTINAL 12KG', 'Alimento Balanceado completo para perros con desordenes gastrointestinales','/uploads/products/12 kg/gastro 12kg.jpg', 140.00, 110.00, 95.00, 6, 1, 2),
('RP007', 'BRIT DIETA BETERINARIA HYPOALLERGENIC 12KG', 'Alimento balanceado hipoalergénico completo para perros con problemas dermatológicos y gastrointestinales','/uploads/products/12 kg/hypo 12kg.jpg', 140.00, 110.00, 95.00, 7, 1, 2),
('RP008', 'BRIT DIETA BETERINARIA RENAL 12KG', 'Alimento balanceado completo para perros con funciones renales dañados','/uploads/products/12 kg/renal 12kg.jpg', 140.00, 110.00, 95.00, 8, 1, 2);

-- Actualizar la tabla inventario para agregar producto_id
UPDATE inventario SET producto_id = 1 WHERE id = 1;
UPDATE inventario SET producto_id = 2 WHERE id = 2;
UPDATE inventario SET producto_id = 3 WHERE id = 3;
UPDATE inventario SET producto_id = 4 WHERE id = 4;
UPDATE inventario SET producto_id = 5 WHERE id = 5;
UPDATE inventario SET producto_id = 6 WHERE id = 6;
UPDATE inventario SET producto_id = 7 WHERE id = 7;
UPDATE inventario SET producto_id = 8 WHERE id = 8;

-- AHORA insertamos en historial_precios DESPUÉS de que los productos existan
INSERT INTO historial_precios (producto_id, precio_unidad, precio_tienda, precio_distribuidor, fecha_update) VALUES
(1, 30.00, 26.00, 20.00, '2022-12-01'),
(2, 30.00, 26.00, 20.00, '2022-12-01'), 
(3, 30.00, 26.00, 20.00, '2022-12-01'),
(4, 30.00, 26.00, 20.00, '2022-12-01'),
(5, 30.00, 26.00, 20.00, '2022-12-01'),
(6, 130.00, 100.00, 85.00, '2022-12-01'),
(7, 130.00, 100.00, 85.00, '2022-12-01'),
(8, 130.00, 100.00, 85.00, '2022-12-01');

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
(1, 1, '2023-04-15 10:30:00', '/uploads/receipt/pago_test.webp', '123456', 859.97);

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

-- Insertar datos de prueba en la tabla carrito
INSERT INTO carrito (usuario_id, is_active) VALUES
(1, 1), -- Carrito para Juan Pérez (Admin)
(2, 1), -- Carrito para María Rodríguez (Employee)
(3, 1); -- Carrito para Carlos Gómez (Customer)

-- Insertar datos de prueba en la tabla carrito_producto
-- Productos en el carrito de Juan Pérez (Admin)
INSERT INTO carrito_producto (carrito_id, producto_id, cantidad) VALUES
(1, 1, 2), -- 2 unidades de BRIT DIETA BETERINARIA HYPOALLERGENIC 2KG
(1, 3, 1), -- 1 unidad de BRIT DIETA BETERINARIA HEPATIC 2KG
(1, 6, 1); -- 1 unidad de BRIT DIETA BETERINARIA GASTROINTESTINAL 12KG

-- Productos en el carrito de María Rodríguez (Employee)
INSERT INTO carrito_producto (carrito_id, producto_id, cantidad) VALUES
(2, 2, 3), -- 3 unidades de BRIT DIETA BETERINARIA GASTROINTESTINAL 2KG
(2, 5, 2); -- 2 unidades de BRIT DIETA BETERINARIA STRUVITE 2KG

-- Productos en el carrito de Carlos Gómez (Customer)
INSERT INTO carrito_producto (carrito_id, producto_id, cantidad) VALUES
(3, 7, 1), -- 1 unidad de BRIT DIETA BETERINARIA HYPOALLERGENIC 12KG
(3, 4, 2), -- 2 unidades de BRIT DIETA BETERINARIA RENAL 2KG
(3, 8, 1); -- 1 unidad de BRIT DIETA BETERINARIA RENAL 12KG