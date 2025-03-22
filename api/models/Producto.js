// models/Producto.js
import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Código único para cada producto",
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre del producto",
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Descripción detallada del producto",
    },
    producto_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Ruta de la imagen del producto",
    },
    precio_unidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio al público",
    },
    precio_tienda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio para tiendas",
    },
    precio_distribuidor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio para distribuidores",
    },
    inventario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del inventario asociado al producto",
      references: {
        model: "Inventario",
        key: "id"
      }
    },
    marca_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la marca del producto",
      references: {
        model: "Marca",
        key: "id"
      }
    },
    categoria_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la categoría del producto",
      references: {
        model: "Categoria",
        key: "id"
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el producto está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "productos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Producto