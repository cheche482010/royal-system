import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID de la orden asociada al pago",
    },
    metodo_pago_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "ID del método de pago utilizado",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha del pago",
    },
    comprobante_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Ruta de la imagen del comprobante de pago",
    },
    numero_referencia: {
      type: DataTypes.STRING(6),
      allowNull: true,
      comment: "Número de referencia del pago",
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto pagado",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el pago está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el pago ha sido marcado como eliminado",
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)

export default Pago