import { DataTypes } from "sequelize"

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable("producto", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      presentacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex("producto", ["codigo"], {
      unique: true,
      name: "idx_producto_codigo",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("producto")
  },
}

