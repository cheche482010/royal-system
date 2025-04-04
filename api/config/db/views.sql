-- 1. Vista de Productos con Información Completa
CREATE VIEW vw_productos_completos AS
SELECT 
    p.id, 
    p.codigo, 
    p.nombre, 
    p.descripcion, 
    p.producto_img, 
    p.precio_unidad, 
    p.precio_tienda, 
    p.precio_distribuidor,
    m.nombre AS marca, 
    m.logo_img AS marca_logo,
    c.nombre AS categoria,
    i.cantidad_actual AS stock,
    i.estado AS estado_inventario,
    p.is_active
FROM 
    productos p
JOIN 
    marcas m ON p.marca_id = m.id
JOIN 
    categorias c ON p.categoria_id = c.id
JOIN 
    inventario i ON p.inventario_id = i.id
WHERE 
    p.is_delete = 0 AND p.is_active = 1;

-- 2. Vista de Productos en Stock
CREATE VIEW vw_productos_disponibles AS
SELECT 
    p.id, 
    p.codigo, 
    p.nombre, 
    p.precio_unidad,
    i.cantidad_actual AS stock
FROM 
    productos p
JOIN 
    inventario i ON p.inventario_id = i.id
WHERE 
    i.cantidad_actual > 0 
    AND i.estado = 'Disponible'
    AND p.is_delete = 0 
    AND p.is_active = 1;

-- 3. Vista de Carrito de Compras Activo
CREATE VIEW vw_carrito_activo AS
SELECT 
    c.id AS carrito_id,
    c.usuario_id,
    u.nombre AS nombre_usuario,
    cp.producto_id,
    p.nombre AS nombre_producto,
    p.producto_img,
    cp.cantidad,
    p.precio_unidad,
    (cp.cantidad * p.precio_unidad) AS subtotal
FROM 
    carrito c
JOIN 
    usuarios u ON c.usuario_id = u.id
JOIN 
    carrito_producto cp ON c.id = cp.carrito_id
JOIN 
    productos p ON cp.producto_id = p.id
WHERE 
    c.is_active = 1 
    AND cp.is_active = 1
    AND c.is_delete = 0;

-- 4. Vista de Resumen de Carrito por Usuario
CREATE VIEW vw_resumen_carrito AS
SELECT 
    c.usuario_id,
    u.nombre AS nombre_usuario,
    c.id AS carrito_id,
    COUNT(cp.id) AS total_productos,
    SUM(cp.cantidad) AS cantidad_total,
    SUM(cp.cantidad * p.precio_unidad) AS monto_total
FROM 
    carrito c
JOIN 
    usuarios u ON c.usuario_id = u.id
JOIN 
    carrito_producto cp ON c.id = cp.carrito_id
JOIN 
    productos p ON cp.producto_id = p.id
WHERE 
    c.is_active = 1 
    AND c.is_delete = 0
GROUP BY 
    c.usuario_id, u.nombre, c.id;

-- 5. Vista de Historial de Órdenes por Usuario
CREATE VIEW vw_historial_ordenes AS
SELECT 
    o.id AS orden_id,
    o.usuario_id,
    u.nombre AS nombre_usuario,
    o.monto_total,
    o.status,
    o.created_at AS fecha_orden,
    f.numero_factura,
    f.status_factura,
    COUNT(do.id) AS total_productos,
    SUM(do.cantidad) AS cantidad_total
FROM 
    ordenes o
JOIN 
    usuarios u ON o.usuario_id = u.id
JOIN 
    detalles_orden do ON o.id = do.orden_id
LEFT JOIN 
    facturas f ON o.id = f.orden_id
GROUP BY 
    o.id, o.usuario_id, u.nombre, o.monto_total, o.status, o.created_at, f.numero_factura, f.status_factura;

-- 6. Vista de Detalles de Órdenes Completa
CREATE VIEW vw_detalles_orden_completa AS
SELECT 
    do.id,
    do.orden_id,
    o.usuario_id,
    u.nombre AS nombre_usuario,
    do.producto_id,
    p.nombre AS nombre_producto,
    p.codigo AS codigo_producto,
    do.cantidad,
    do.precio,
    (do.cantidad * do.precio) AS subtotal,
    o.status AS estado_orden,
    o.created_at AS fecha_orden
FROM 
    detalles_orden do
JOIN 
    ordenes o ON do.orden_id = o.id
JOIN 
    usuarios u ON o.usuario_id = u.id
JOIN 
    productos p ON do.producto_id = p.id;

-- 7. Vista de Pagos con Información Completa
CREATE VIEW vw_pagos_completos AS
SELECT 
    p.id AS pago_id,
    p.orden_id,
    o.usuario_id,
    u.nombre AS nombre_usuario,
    mp.nombre AS metodo_pago,
    p.fecha,
    p.numero_referencia,
    p.monto,
    p.comprobante_img,
    o.status AS estado_orden,
    f.numero_factura
FROM 
    pagos p
JOIN 
    ordenes o ON p.orden_id = o.id
JOIN 
    usuarios u ON o.usuario_id = u.id
JOIN 
    metodos_pago mp ON p.metodo_pago_id = mp.id
LEFT JOIN 
    facturas f ON o.id = f.orden_id
WHERE 
    p.is_delete = 0;

-- 8. Vista de Tasa de Cambio Actual
CREATE VIEW vw_tasa_cambio_actual AS
SELECT 
    id,
    tasa_cambio,
    fecha_inicio,
    fecha_fin
FROM 
    dolar_bcv
WHERE 
    is_active = 1 
    AND (fecha_fin IS NULL OR fecha_fin > NOW())
ORDER BY 
    fecha_inicio DESC
LIMIT 1;

-- 9. Vista de Productos con Precios en Bolívares
CREATE VIEW vw_productos_bolivares AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.precio_unidad AS precio_usd,
    p.precio_tienda AS precio_tienda_usd,
    p.precio_distribuidor AS precio_distribuidor_usd,
    (p.precio_unidad * d.tasa_cambio) AS precio_ves,
    (p.precio_tienda * d.tasa_cambio) AS precio_tienda_ves,
    (p.precio_distribuidor * d.tasa_cambio) AS precio_distribuidor_ves,
    d.tasa_cambio
FROM 
    productos p
CROSS JOIN 
    (SELECT tasa_cambio FROM vw_tasa_cambio_actual) d
WHERE 
    p.is_delete = 0 
    AND p.is_active = 1;

-- 10. Vista de Inventario Crítico
CREATE VIEW vw_inventario_critico AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    i.cantidad_actual,
    i.estado,
    m.nombre AS marca,
    c.nombre AS categoria
FROM 
    productos p
JOIN 
    inventario i ON p.inventario_id = i.id
JOIN 
    marcas m ON p.marca_id = m.id
JOIN 
    categorias c ON p.categoria_id = c.id
WHERE 
    i.cantidad_actual <= 100
    AND p.is_delete = 0 
    AND p.is_active = 1
ORDER BY 
    i.cantidad_actual ASC;

-- 11. Vista de Ventas por Producto
CREATE VIEW vw_ventas_por_producto AS
SELECT 
    p.id AS producto_id,
    p.codigo,
    p.nombre,
    m.nombre AS marca,
    c.nombre AS categoria,
    SUM(do.cantidad) AS unidades_vendidas,
    SUM(do.cantidad * do.precio) AS monto_total_ventas,
    COUNT(DISTINCT do.orden_id) AS numero_ordenes
FROM 
    productos p
JOIN 
    detalles_orden do ON p.id = do.producto_id
JOIN 
    ordenes o ON do.orden_id = o.id
JOIN 
    marcas m ON p.marca_id = m.id
JOIN 
    categorias c ON p.categoria_id = c.id
WHERE 
    o.status = 'Completa'
GROUP BY 
    p.id, p.codigo, p.nombre, m.nombre, c.nombre
ORDER BY 
    unidades_vendidas DESC;

-- 12. Vista de Usuarios Activos con Roles
CREATE VIEW vw_usuarios_activos AS
SELECT 
    id,
    documento,
    nombre,
    correo,
    telefono,
    role,
    is_active,
    created_at AS fecha_registro
FROM 
    usuarios
WHERE 
    is_active = 1 
    AND is_delete = 0;