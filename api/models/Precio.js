import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Precio = sequelize.define(
  "Precio",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo_precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nombre_precio: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    precio_unidad: {
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
    tableName: "precio",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

export default Precio

