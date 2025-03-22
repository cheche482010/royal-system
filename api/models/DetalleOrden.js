// models/DetalleOrden.js
import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const DetalleOrden = sequelize.define(
  "DetalleOrden",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la orden a la que pertenece el detalle",
      references: {
        model: "Orden",
        key: "id"
      }
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del producto incluido en la orden",
      references: {
        model: "Producto",
        key: "id"
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad del producto",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio unitario al momento de la compra",
    },
  },
  {
    tableName: "detalles_orden",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default DetalleOrden