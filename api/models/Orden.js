// models/Orden.js
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
      references: {
        model: "Usuario",
        key: "id"
      }
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto total de la orden",
    },
    status: {
      type: DataTypes.ENUM("Pendiente", "Completa", "Cancelada"),
      defaultValue: "Pendiente",
      comment: "Estado de la orden",
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