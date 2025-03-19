import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
import Usuario from "./Usuario.js"
import Precio from "./Precio.js"

const PrecioUsuario = sequelize.define(
  "PrecioUsuario",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    precio_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Precio,
        key: "id",
      },
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
    tableName: "precio_usuario",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["usuario_id", "precio_id"],
      },
    ],
  },
)

// Define associations
Usuario.hasMany(PrecioUsuario, { foreignKey: "usuario_id" })
PrecioUsuario.belongsTo(Usuario, { foreignKey: "usuario_id" })

Precio.hasMany(PrecioUsuario, { foreignKey: "precio_id" })
PrecioUsuario.belongsTo(Precio, { foreignKey: "precio_id" })

export default PrecioUsuario

