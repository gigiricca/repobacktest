const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rol = sequelize.define(
  "Rol",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Esto lo mantienes si no quieres los campos createdAt y updatedAt
    tableName: 'Rol'
  }
);

module.exports = Rol;
