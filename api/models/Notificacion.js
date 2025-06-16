import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Notificacion = sequelize.define(
  "Notificacion",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que recibe la notificación",
    },
    orden_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la orden relacionada",
    },
    tipo: {
      type: DataTypes.ENUM("ORDEN_CREADA", "ORDEN_COMPLETADA", "ORDEN_CANCELADA"),
      allowNull: false,
      comment: "Tipo de notificación",
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Título de la notificación",
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Mensaje de la notificación",
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si la notificación ha sido leída",
    },
  },
  {
    tableName: "notificaciones",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

export default Notificacion
