const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Menu = sequelize.define("Menu", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = Menu;
