// models/Marca.js
import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Marca = sequelize.define(
  "Marca",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre de la marca",
    },
    descripcion: {
      type: DataTypes.TEXT,
      comment: "Descripción de la marca",
    },
    logo_img: {
      type: DataTypes.STRING(255),
      comment: "Ruta de la imagen del logo",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si la marca está activa",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "marcas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Marca