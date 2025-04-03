import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const HistorialPrecio = sequelize.define(
  "HistorialPrecio",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del producto",
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
    fecha_update: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de actualización del precio",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el registro está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "historial_precios",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default HistorialPrecio