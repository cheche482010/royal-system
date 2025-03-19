import { DataTypes } from "sequelize"

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable("usuarios", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      rif_cedula: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      registro_mercantil: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      volumen_compra: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING(20),
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
    await queryInterface.addIndex("usuarios", ["rif_cedula"], {
      unique: true,
      name: "idx_usuarios_rif_cedula",
    })

    await queryInterface.addIndex("usuarios", ["correo"], {
      unique: true,
      name: "idx_usuarios_correo",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("usuarios")
  },
}

