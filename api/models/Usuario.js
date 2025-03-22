import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
import bcrypt from "bcrypt"

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    documento: {
      type: DataTypes.STRING(15),
      allowNull: false,
      comment: "Rif o Cedula del usuario",
    },
    documento_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Ruta de la imagen del RIF o Cédula",
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nombre completo del usuario",
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Dirección física del usuario",
    },
    registro_mercantil_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Ruta de la imagen del registro mercantil",
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Correo electrónico (único)",
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Número de teléfono",
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Hash de la contraseña",
    },
    role: {
      type: DataTypes.ENUM("Admin", "Employee", "Customer"),
      defaultValue: "Customer",
      comment: "Rol del usuario en el sistema",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Token firma digital",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indica si el usuario está activo",
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si el usuario ha sido marcado como eliminado",
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.user_password) {
          const salt = await bcrypt.genSalt(10)
          usuario.user_password = await bcrypt.hash(usuario.user_password, salt)
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("user_password") && usuario.user_password) {
          const salt = await bcrypt.genSalt(10)
          usuario.user_password = await bcrypt.hash(usuario.user_password, salt)
        }
      },
    },
  },
)

// Instance method to compare passwords
Usuario.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.user_password)
}

export default Usuario

