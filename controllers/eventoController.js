const Evento = require("../models/evento");

exports.getAllEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

exports.createEvento = async (req, res) => {
  try {
    const { cliente_id, fecha, tipo_evento, num_invitados } = req.body;
    const evento = await Evento.create({
      cliente_id,
      fecha,
      tipo_evento,
      num_invitados,
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: "Error al crear evento" });
  }
};
