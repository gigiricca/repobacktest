const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cliente = require("./cliente");

const Evento = sequelize.define("Evento", {
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tipo_evento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num_invitados: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Evento.belongsTo(Cliente, { foreignKey: "cliente_id" });

module.exports = Evento;
