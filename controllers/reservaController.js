const Reserva = require("../models/reserva");

exports.getAllReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

exports.createReserva = async (req, res) => {
  try {
    const { evento_id, menu_id, cantidad } = req.body;
    const reserva = await Reserva.create({ evento_id, menu_id, cantidad });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: "Error al crear reserva" });
  }
};
