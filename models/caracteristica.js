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
  productoId: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  }
}, 
{
timestamps: false,
tableName: 'caracteristicas'
});

module.exports = Caracteristica;
