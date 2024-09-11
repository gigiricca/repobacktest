const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./usuario");
const Producto = require("./producto");

const Favorito = sequelize.define("Favorito", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  productoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Producto,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'favoritos'
});

// Establecer las relaciones
Usuario.belongsToMany(Producto, { through: Favorito, foreignKey: 'userId', as: 'favoritos' });
Producto.belongsToMany(Usuario, { through: Favorito, foreignKey: 'productoId', as: 'usuariosFavoritos' });

module.exports = Favorito;