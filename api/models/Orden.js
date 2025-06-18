import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Orden = sequelize.define(
  "Orden",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que realizó la orden",
    },
    status: {
      type: DataTypes.ENUM("Pendiente", "Completa", "Cancelada"),
      defaultValue: "Pendiente",
      comment: "Estado de la orden",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si la orden está activa",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si la orden ha sido marcada como eliminada",
    },
  },
  {
    tableName: "ordenes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Orden