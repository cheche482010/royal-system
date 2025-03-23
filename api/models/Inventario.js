import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Inventario = sequelize.define(
  "Inventario",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cantidad_inicial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad inicial en inventario",
    },
    cantidad_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad actual en inventario",
    },
    lote: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Número de lote",
    },
    estado: {
      type: DataTypes.ENUM("Disponible", "Reservado", "Agotado"),
      defaultValue: "Disponible",
      comment: "Estado del inventario",
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de ingreso al inventario",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el registro está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el registro ha sido marcado como eliminado",
    },
  },
  {
    tableName: "inventario",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Inventario