-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: royal-system
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL COMMENT 'ID del usuario que realizó la acción',
  `fecha` date NOT NULL COMMENT 'Fecha de la acción',
  `hora` time NOT NULL COMMENT 'Hora de la acción',
  `accion` text NOT NULL COMMENT 'Descripción de la acción realizada',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el registro ha sido marcado como eliminado',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL COMMENT 'ID del usuario propietario del carrito',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el carrito está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el carrito ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_carrito_usuario` (`usuario_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carrito_producto`
--

DROP TABLE IF EXISTS `carrito_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_producto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `carrito_id` bigint NOT NULL COMMENT 'ID del carrito al que pertenece el producto',
  `producto_id` bigint NOT NULL COMMENT 'ID del producto agregado al carrito',
  `cantidad` int NOT NULL COMMENT 'Cantidad del producto en el carrito',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el registro está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el registro ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_carrito_producto_unique` (`carrito_id`, `producto_id`),
  KEY `idx_carrito_producto_carrito` (`carrito_id`),
  KEY `idx_carrito_producto_producto` (`producto_id`),
  CONSTRAINT `carrito_producto_ibfk_1` FOREIGN KEY (`carrito_id`) REFERENCES `carrito` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carrito_producto_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre de la categoría',
  `codigo` varchar(50) NOT NULL COMMENT 'Código único para cada categoría (0001, 0002, etc.)',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si la categoría está activa',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si la categoría ha sido marcada como eliminada',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `idx_categorias_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalles_orden`
--

DROP TABLE IF EXISTS `detalles_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_orden` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orden_id` bigint NOT NULL COMMENT 'ID de la orden a la que pertenece el detalle',
  `producto_id` bigint NOT NULL COMMENT 'ID del producto incluido en la orden',
  `cantidad` int NOT NULL COMMENT 'Cantidad del producto',
  `precio` decimal(10,2) NOT NULL COMMENT 'Precio unitario al momento de la compra',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `idx_detalles_orden_producto` (`producto_id`),
  CONSTRAINT `detalles_orden_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalles_orden_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dolar_bcv`
--

DROP TABLE IF EXISTS `dolar_bcv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dolar_bcv` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tasa_cambio` decimal(10,4) NOT NULL COMMENT 'Tasa de cambio USD a VES',
  `fecha_inicio` datetime NOT NULL COMMENT 'Fecha inicio de vigencia',
  `fecha_fin` datetime DEFAULT NULL COMMENT 'Fecha fin de vigencia',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si la tasa está activa',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el registro ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE coupons (
  id bigint NOT NULL AUTO_INCREMENT,
  codigo varchar(255) NOT NULL COMMENT 'Código de promoción',
  fecha_inicio datetime NOT NULL COMMENT 'Fecha inicio de vigencia',
  fecha_fin datetime DEFAULT NULL COMMENT 'Fecha fin de vigencia',
  is_active tinyint(1) DEFAULT '1' COMMENT 'Indica si el cupón está activo',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orden_id` bigint NOT NULL COMMENT 'ID de la orden asociada a la factura',
  `numero_factura` varchar(50) NOT NULL COMMENT 'Número único de factura',
  `fecha_emision` date NOT NULL COMMENT 'Fecha de emisión de la factura',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Subtotal de la factura',
  `status_factura` enum('Activa','Anulada') DEFAULT 'Activa' COMMENT 'Estado de la factura',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si la factura ha sido marcada como eliminada',
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_factura` (`numero_factura`),
  KEY `orden_id` (`orden_id`),
  CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historial_precios`
--

DROP TABLE IF EXISTS `historial_precios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_precios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `producto_id` bigint NOT NULL COMMENT 'ID del producto',
  `precio_unidad` decimal(10,2) NOT NULL COMMENT 'Precio al público',
  `precio_tienda` decimal(10,2) NOT NULL COMMENT 'Precio para tiendas',
  `precio_distribuidor` decimal(10,2) NOT NULL COMMENT 'Precio para distribuidores',
  `fecha_update` timestamp NOT NULL COMMENT 'Fecha de actualización del precio',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el registro está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el registro ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `historial_precios_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `producto_id` bigint DEFAULT NULL,
  `cantidad_inicial` int NOT NULL COMMENT 'Cantidad inicial en inventario',
  `cantidad_actual` int NOT NULL COMMENT 'Cantidad actual en inventario',
  `lote` varchar(50) DEFAULT NULL COMMENT 'Número de lote',
  `estado` enum('Disponible','Reservado','Agotado') DEFAULT 'Disponible' COMMENT 'Estado del inventario',
  `fecha_ingreso` date NOT NULL COMMENT 'Fecha de ingreso al inventario',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el registro está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el registro ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inventario_producto` (`producto_id`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre de la marca',
  `descripcion` text COMMENT 'Descripción de la marca',
  `logo_img` varchar(255) DEFAULT NULL COMMENT 'Ruta de la imagen del logo',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si la marca está activa',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si la marca ha sido marcada como eliminada',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'Nombre del método de pago',
  `descripcion` text COMMENT 'Descripción del método de pago',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el método de pago está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el método de pago ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL COMMENT 'ID del usuario que realizó la orden',
  `monto_total` decimal(10,2) NOT NULL COMMENT 'Monto total de la orden',
  `status` enum('Pendiente','Completa','Cancelada') DEFAULT 'Pendiente' COMMENT 'Estado de la orden',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_ordenes_usuario` (`usuario_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orden_id` bigint NOT NULL COMMENT 'ID de la orden asociada al pago',
  `metodo_pago_id` bigint NOT NULL COMMENT 'ID del método de pago utilizado',
  `fecha` datetime NOT NULL COMMENT 'Fecha del pago',
  `comprobante_img` varchar(255) NOT NULL COMMENT 'Ruta de la imagen del comprobante de pago',
  `numero_referencia` varchar(6) DEFAULT NULL COMMENT 'Número de referencia del pago',
  `monto` decimal(10,2) NOT NULL COMMENT 'Monto pagado',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el pago está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el pago ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `metodo_pago_id` (`metodo_pago_id`),
  KEY `idx_pagos_orden` (`orden_id`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL COMMENT 'Código único para cada producto',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del producto',
  `descripcion` varchar(500) NOT NULL COMMENT 'Descripción detallada del producto',
  `producto_img` varchar(255) NOT NULL COMMENT 'Ruta de la imagen del producto',
  `precio_unidad` decimal(10,2) NOT NULL COMMENT 'Precio al público',
  `precio_tienda` decimal(10,2) NOT NULL COMMENT 'Precio para tiendas',
  `precio_distribuidor` decimal(10,2) NOT NULL COMMENT 'Precio para distribuidores',
  `inventario_id` bigint NOT NULL COMMENT 'ID del inventario asociado al producto',
  `marca_id` bigint NOT NULL COMMENT 'ID de la marca del producto',
  `categoria_id` bigint NOT NULL COMMENT 'ID de la categoría del producto',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el producto está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el producto ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `inventario_id` (`inventario_id`),
  KEY `idx_productos_marca` (`marca_id`),
  KEY `idx_productos_categoria` (`categoria_id`),
  KEY `idx_productos_nombre` (`nombre`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sesiones`
--

DROP TABLE IF EXISTS `sesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesiones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL COMMENT 'ID del usuario que inició sesión',
  `token` varchar(255) NOT NULL COMMENT 'Token de autenticación JWT',
  `ip` varchar(45) NOT NULL COMMENT 'Dirección IP del dispositivo',
  `expiracion` timestamp NOT NULL COMMENT 'Fecha y hora de expiración de la sesión',
  `agente_usuario` text COMMENT 'Información del navegador y sistema operativo',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si la sesión está activa',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la sesión',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_sesion_expiracion` (`expiracion`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `documento` varchar(15) NOT NULL COMMENT 'Rif o Cedula del usuario',
  `documento_img` varchar(255) NOT NULL COMMENT 'Ruta de la imagen del RIF o Cédula',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre completo del usuario',
  `direccion` varchar(200) NOT NULL COMMENT 'Dirección física del usuario',
  `registro_mercantil_img` varchar(255) NOT NULL COMMENT 'Ruta de la imagen del registro mercantil',
  `correo` varchar(100) NOT NULL COMMENT 'Correo electrónico (único)',
  `telefono` varchar(20) NOT NULL COMMENT 'Número de teléfono',
  `user_password` varchar(255) NOT NULL COMMENT 'Hash de la contraseña',
  `role` enum('Admin','Employee','Customer') DEFAULT 'Customer' COMMENT 'Rol del usuario en el sistema',
  `token` text NOT NULL COMMENT 'Token para autenticación',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Indica si el usuario está activo',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT 'Indica si el usuario ha sido marcado como eliminado',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-04 11:29:31