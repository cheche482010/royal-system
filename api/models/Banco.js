import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Banco = sequelize.define(
  "Banco",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Código del banco",
    },
    nombre_banco: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Nombre del banco",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Fecha de creación del registro",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      comment: "Fecha de última actualización",
    },
  },
  {
    tableName: "bancos",
    timestamps: true, 
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Banco;