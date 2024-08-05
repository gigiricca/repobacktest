const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Evento = require("./evento");
const Menu = require("./menu");

const Reserva = sequelize.define("Reserva", {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Reserva.belongsTo(Evento, { foreignKey: "evento_id" });
Reserva.belongsTo(Menu, { foreignKey: "menu_id" });

module.exports = Reserva;
