import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Factura = sequelize.define(
  "Factura",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la orden asociada a la factura",
    },
    numero_factura: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Número único de factura",
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de emisión de la factura",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Subtotal de la factura",
    },
    status_factura: {
      type: DataTypes.ENUM("Activa", "Anulada"),
      defaultValue: "Activa",
      comment: "Estado de la factura",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si la factura ha sido marcada como eliminada",
    },
  },
  {
    tableName: "facturas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Factura