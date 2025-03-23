import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre de la categoría",
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Código único para cada categoría (0001, 0002, etc.)",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si la categoría está activa",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si la categoría ha sido marcada como eliminada",
    },
  },
  {
    tableName: "categorias",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Categoria