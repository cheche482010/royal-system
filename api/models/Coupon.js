import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Código de promoción",
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
      comment: "Indica si el cupón está activo",
    },
  },
  {
    tableName: "coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

export default Coupon

