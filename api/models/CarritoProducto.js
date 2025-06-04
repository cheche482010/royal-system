import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const CarritoProducto = sequelize.define(
  "CarritoProducto",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    carrito_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del carrito al que pertenece el producto",
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del producto agregado al carrito",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad del producto en el carrito",
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
    tableName: "carrito_producto",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

export default CarritoProducto

