import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
import PrecioUsuario from "./PrecioUsuario.js"
import Producto from "./Producto.js"

const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    precio_usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: PrecioUsuario,
        key: "id",
      },
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Producto,
        key: "id",
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    referencia: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    numero_referencia: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

// Define associations
PrecioUsuario.hasMany(Pago, { foreignKey: "precio_usuario_id" })
Pago.belongsTo(PrecioUsuario, { foreignKey: "precio_usuario_id" })

Producto.hasMany(Pago, { foreignKey: "producto_id" })
Pago.belongsTo(Producto, { foreignKey: "producto_id" })

export default Pago

