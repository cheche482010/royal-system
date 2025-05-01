import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Envio = sequelize.define(
  "Envio",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la orden asociada",
    },
    nombre_receptor: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre del destinatario",
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Dirección de envío",
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Ciudad de envío",
    },
    estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Estado/Provincia de envío",
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Teléfono de contacto para el envío",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el envio está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el envio ha sido marcado como eliminado",
    },
  },
  {
    tableName: "envios",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Envio