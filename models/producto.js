// models/producto.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Imagen = require("./imagen");

const Producto = sequelize.define("producto", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  precio: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
}, {
  timestamps: false
});

// Definir la relación
Producto.hasMany(Imagen, { as: 'imagenes', foreignKey: 'productoId' });
Imagen.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = Producto;
