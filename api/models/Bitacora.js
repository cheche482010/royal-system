import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Bitacora = sequelize.define(
  "Bitacora",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que realizó la acción",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de la acción",
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "Hora de la acción",
    },
    accion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Descripción de la acción realizada",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "bitacora",
    timestamps: false,
  }
)

export default Bitacora