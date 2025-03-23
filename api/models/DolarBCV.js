import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const DolarBCV = sequelize.define(
  "DolarBCV",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    tasa_cambio: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      comment: "Tasa de cambio USD a VES",
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha inicio de vigencia",
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha fin de vigencia",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si la tasa está activa",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "dolar_bcv",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default DolarBCV