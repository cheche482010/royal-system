-- Insertar datos de prueba en la tabla usuarios
INSERT INTO `usuarios` 
VALUES 
  (
    1,
    '1111111',
    'uploads\\user\\1111111\\documento_img.jpg',
    'User Amin',
    'direccion admin 1 ',
    'useraAmin@gmail.com',
    '04161835429',
    '$2b$10$jb/0BPFmEFyjkgYllpFCDOq8eBrDcWe.aoJFvPBcP32n8aatg0ATC',
    'Admin',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJ1c2VyYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzUwNDQyNjM4LCJleHAiOjE3NTMwMzQ2Mzh9.jk6l_azK7K3MSF4GfWgXQuDDks7yma1rSCkBkXBT54U',
    1,
    0,
    '2025-06-20 18:03:58',
    '2025-06-20 18:03:58'
  ),
  (
    2,
    '2222222',
    'uploads\\user\\2222222\\documento_img.jpg',
    'User Employee',
    'direccion Employee 2',
    'userEmployee@gmail.com',
    '04161835429',
    '$2b$10$YbApRvCWKC/m4c6n9gkfNukjq3e8vpODGhFPjwfaMJLAeghImChL2',
    'Employee',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJ1c2VyRW1wbG95ZWVAZ21haWwuY29tIiwiaWF0IjoxNzUwNDQyNzUwLCJleHAiOjE3NTMwMzQ3NTB9.570QvEkukGlfdzmXyLjzQEzCN5QsFoEsubvF4u2cEtg',
    1,
    0,
    '2025-06-20 18:05:50',
    '2025-06-20 18:05:50'
  ),
  (
    3,
    '3333333',
    'uploads\\user\\3333333\\documento_img.jpg',
    'User Customer',
    'direccion Customer 3',
    'userCustomer@gmail.com',
    '04161835429',
    '$2b$10$A8yIbkCIt2P0HZfrN.xvO.SML3dqrJCoVXvyah6JNR1wVgFLDtCQK',
    'Customer',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJ1c2VyQ3VzdG9tZXJAZ21haWwuY29tIiwiaWF0IjoxNzUwNDQyODE1LCJleHAiOjE3NTMwMzQ4MTV9.yN0ilrPAVeDUD78tMzF8kqzkQ5it2ECfksGvieJI9VM',
    1,
    0,
    '2025-06-20 18:06:55',
    '2025-06-20 18:06:55'
  );

-- Contraseñas de prueba:
-- Admin: Contraseña1
-- Employee: Contraseña2
-- Customer: Contraseña3

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
('RP001', 'BRIT DIETA BETERINARIA HYPOALLERGENIC 2KG', 'Alimento balanceado hipoalergénico completo para perros con problemas dermatológicos y gastrointestinales', '/uploads/products/2_kg/hypo_2kg.jpg', 32.00, 28.00, 22.00, 1, 1, 2),
('RP002', 'BRIT DIETA BETERINARIA GASTROINTESTINAL 2KG', 'Alimento Balanceado completo para perros con desordenes gastrointestinales','/uploads/products/2_kg/gastro_2kg.jpg', 32.00, 28.00, 22.00, 2, 1, 2),
('RP003', 'BRIT DIETA BETERINARIA HEPATIC 2KG', 'Alimento balanceado completo para perros con funciones hepáticas dañadas','/uploads/products/2_kg/hepatic_2kg.jpg', 32.00, 28.00, 22.00, 3, 1, 2),
('RP004', 'BRIT DIETA BETERINARIA RENAL 2KG', 'Alimento balanceado completo para perros con funciones renales dañados','/uploads/products/2_kg/renal_2kg.jpg', 32.00, 28.00, 22.00, 4, 1, 2),
('RP005', 'BRIT DIETA BETERINARIA STRUVITE 2KG', 'Alimento Balanceado completo para control de perros con enfermedades de tracto urinario inferior','/uploads/products/2_kg/struvite_2kg.jpg', 32.00, 28.00, 22.00, 5, 1, 2),
('RP006', 'BRIT DIETA BETERINARIA GASTROINTESTINAL 12KG', 'Alimento Balanceado completo para perros con desordenes gastrointestinales','/uploads/products/12_kg/gastro_12kg.jpg', 140.00, 110.00, 95.00, 6, 1, 2),
('RP007', 'BRIT DIETA BETERINARIA HYPOALLERGENIC 12KG', 'Alimento balanceado hipoalergénico completo para perros con problemas dermatológicos y gastrointestinales','/uploads/products/12_kg/hypo_12kg.jpg', 140.00, 110.00, 95.00, 7, 1, 2),
('RP008', 'BRIT DIETA BETERINARIA RENAL 12KG', 'Alimento balanceado completo para perros con funciones renales dañados','/uploads/products/12_kg/renal_12kg.jpg', 140.00, 110.00, 95.00, 8, 1, 2);

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

-- Insertar datos de prueba en la tabla metodos_pago
INSERT INTO metodos_pago (nombre, descripcion) VALUES
('Transferencia Bancaria', 'Pago mediante transferencia a cuenta bancaria'),
('Pago Móvil', 'Pago mediante aplicación de pago móvil');

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

INSERT INTO bancos (id, codigo, nombre_banco) VALUES 
(1, '0001', 'Banco Central de Venezuela'),
(2, '0102', 'Banco de Venezuela, S.A.'),
(3, '0104', 'Banco Venezolano de Crédito, S.A.'),
(4, '0105', 'Banco Mercantil C.A.'),
(5, '0108', 'Banco Provincial, S.A.'),
(6, '0114', 'Banco del Caribe C.A.'),
(7, '0115', 'Banco Exterior C.A.'),
(8, '0128', 'Banco Caroní C.A.'),
(9, '0134', 'Banesco Banco Universal, C.A.'),
(10, '0137', 'Banco Sofitasa'),
(11, '0138', 'Banco Plaza'),
(12, '0146', 'Banco de la Gente Emprendedora C.A.'),
(13, '0151', 'Banco Fondo Común, C.A'),
(14, '0157', 'DelSur, Banco Universal C.A.'),
(15, '0163', 'Banco del Tesoro C.A.'),
(16, '0166', 'Banco Agrícola de Venezuela C.A.'),
(17, '0168', 'Bancrecer S.A.'),
(18, '0169', 'Mi Banco'),
(19, '0171', 'Banco Activo C.A.'),
(21, '0172', 'Bancamiga Banco Universal, C.A.'),
(22, '0173', 'Banco Internacional de Desarrollo C.A.'),
(23, '0174', 'Banplus Banco Universal, C.A.'),
(24, '0175', 'Banco Bicentenario del Pueblo, Banco Universal C.A.'),
(25, '0177', 'Banco de la Fuerza Armada Nacional Bolivariana, B.U.'),
(26, '0178', 'N58 Banco Digital'),
(27, '0191', 'Banco Nacional de Crédito C.A.'),
(28, '0601', 'Instituto Municipal de Crédito Popular');

-- Insertar datos de prueba en la tabla cupones
INSERT INTO coupons (codigo, descuento, tipo_descuento, fecha_inicio, fecha_fin, max_usos) VALUES
('CUPON1', '10', 'porcentaje', '2023-04-01 00:00:00', '2023-04-30 23:59:59', 10),
('CUPON2', '20', 'monto_fijo', '2023-04-01 00:00:00', '2023-04-30 23:59:59', 5),
('CUPON3', '15', 'porcentaje', '2023-04-01 00:00:00', '2023-04-30 23:59:59', 15);
