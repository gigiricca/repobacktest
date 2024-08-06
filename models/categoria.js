// models/categoria.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categoria = sequelize.define("categoria", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'categorias'  // Especifica el nombre de la tabla
});

module.exports = Categoria;
