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
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del producto incluido en la orden",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Cantidad del producto",
    },
    tipo_precio: {
      type: DataTypes.ENUM("unidad", "tienda", "distribuidor"),
      allowNull: false,
      comment: "Tipo de precio aplicado al producto",
    },
    precio_bs: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Precio del producto en bolívares ((precio del producto * cantidad de productos)) * tasa_cambio",
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