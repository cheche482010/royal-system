import { DataTypes } from "sequelize"

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable("pagos", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      precio_usuario_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "precio_usuario",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      producto_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "producto",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      referencia: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      numero_referencia: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    })

    // Add indexes
    await queryInterface.addIndex("pagos", ["precio_usuario_id"], {
      name: "idx_pagos_precio_usuario_id",
    })

    await queryInterface.addIndex("pagos", ["producto_id"], {
      name: "idx_pagos_producto_id",
    })

    await queryInterface.addIndex("pagos", ["fecha"], {
      name: "idx_pagos_fecha",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("pagos")
  },
}

