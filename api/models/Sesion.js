// models/Sesion.js
import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Sesion = sequelize.define(
  "Sesion",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que inició sesión",
      references: {
        model: "Usuario",
        key: "id"
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: "Token de autenticación JWT",
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: false,
      comment: "Dirección IP del dispositivo",
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha y hora de expiración de la sesión",
    },
    agente_usuario: {
      type: DataTypes.TEXT,
      comment: "Información del navegador y sistema operativo",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si la sesión está activa",
    },
  },
  {
    tableName: "sesiones",
    timestamps: true,
    createdAt: "created_at",
  }
)

export default Sesion