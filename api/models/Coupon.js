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
      unique: true,
      comment: "Código de promoción",
    },
    descuento: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "Valor de descuento (ej. 10%, $20)",
    },
    tipo_descuento: {
      type: DataTypes.ENUM('porcentaje', 'monto_fijo'),
      allowNull: false,
      comment: "Tipo de descuento",
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
    max_usos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Número máximo de usos permitidos (null para ilimitado)",
    },
    usos_actuales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Número de veces que se ha usado el cupón",
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