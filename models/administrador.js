const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const Administrador = sequelize.define(
  "Administrador",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (administrador) => {
        if (administrador.password) {
          const salt = await bcrypt.genSalt(10);
          administrador.password = await bcrypt.hash(administrador.password, salt);
        }
      },
      // Puedes agregar más hooks si es necesario, como beforeUpdate, etc.
    },
    timestamps: false, // Esto lo mantienes si no quieres los campos createdAt y updatedAt
    tableName: 'Administrador'
  }
);

module.exports = Administrador;
