import { DataTypes } from "sequelize"

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable("precio_usuario", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      precio_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "precio",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.addIndex("precio_usuario", ["usuario_id", "precio_id"], {
      unique: true,
      name: "idx_precio_usuario_usuario_precio",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("precio_usuario")
  },
}

