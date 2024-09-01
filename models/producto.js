// models/producto.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Imagen = require("./imagen");
const Caracteristica = require("./caracteristica");

// Definir el modelo Producto
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

// Definir la relación 1 a muchos entre Producto e Imagen
Producto.hasMany(Imagen, { as: 'imagenes', foreignKey: 'productoId' });
Imagen.belongsTo(Producto, { foreignKey: 'productoId' });

// Definir la relación muchos a muchos entre Producto y Caracteristica con un valor adicional
const ProductoCaracteristica = sequelize.define('ProductoCaracteristica', {
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { timestamps: false });

Producto.belongsToMany(Caracteristica, { through: ProductoCaracteristica, as: 'caracteristicas' });
Caracteristica.belongsToMany(Producto, { through: ProductoCaracteristica, as: 'productos' });

module.exports = Producto;
