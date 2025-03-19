import { DataTypes } from "sequelize"

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable("precio", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombre_precio: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      precio_unidad: {
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
    await queryInterface.addIndex("precio", ["codigo_precio"], {
      unique: true,
      name: "idx_precio_codigo_precio",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("precio")
  },
}

