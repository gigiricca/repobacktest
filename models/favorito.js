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
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  producto_id: {
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
Producto.belongsToMany(Usuario, { through: Favorito, foreignKey: 'producto_id', as: 'usuariosFavoritos' });

module.exports = Favorito;