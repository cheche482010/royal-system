import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const CouponUsado = sequelize.define(
  "CouponUsado",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_uso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Fecha en que se usó el cupón",
    },
  },
  {
    tableName: "cupones_usados",
    timestamps: false,
  },
)

export default CouponUsado