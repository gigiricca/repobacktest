// models/imagen.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Imagen = sequelize.define("imagen", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'imagenes'
});

module.exports = Imagen;
