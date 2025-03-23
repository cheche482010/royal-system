import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del usuario que agregó el producto",
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del producto agregado",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad del producto en el carrito",
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Fecha en que se agregó al carrito",
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
    tableName: "carrito",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Carrito