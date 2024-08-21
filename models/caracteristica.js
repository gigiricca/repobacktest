const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Caracteristica = sequelize.define("Caracteristica", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, 
{
timestamps: false,
tableName: 'caracteristicas'
});

module.exports = Caracteristica;
