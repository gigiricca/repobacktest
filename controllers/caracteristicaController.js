const Caracteristica = require("../models/caracteristica");
const sequelize = require("../config/database");

// Obtener todas las caracteristica
exports.getAllCaracteristicas = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.findAll();
    res.json(caracteristica);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener caracteristica " + error });
  }
};
