// models/MetodoPago.js
import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const MetodoPago = sequelize.define(
  "MetodoPago",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Nombre del método de pago",
    },
    descripcion: {
      type: DataTypes.TEXT,
      comment: "Descripción del método de pago",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el método de pago está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "metodos_pago",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default MetodoPago