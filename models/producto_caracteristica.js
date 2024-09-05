const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Caracteristica = require("./caracteristica");
const Producto = require("./producto");

// Definir la relación muchos a muchos entre Producto y Caracteristica con un valor adicional
const ProductoCaracteristica = sequelize.define('productos_caracteristicas', {
    valor: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, { 
    timestamps: false,
    tableName: 'productos_caracteristicas'
  });
  
  // Definir las asociaciones muchos a muchos correctamente
  Producto.belongsToMany(Caracteristica, { 
    through: ProductoCaracteristica, 
    as: 'caracteristicas', 
    foreignKey: 'productoId',  // Especificar foreignKey de Producto
    otherKey: 'caracteristicaId' // Especificar otherKey de Caracteristica
  });
  
  Caracteristica.belongsToMany(Producto, { 
    through: ProductoCaracteristica, 
    as: 'productos', 
    foreignKey: 'caracteristicaId',  // Especificar foreignKey de Caracteristica
    otherKey: 'productoId'  // Especificar otherKey de Producto
  });
  
  module.exports = ProductoCaracteristica;
