const Cliente = require("../models/cliente");

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes"+error });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const cliente = await Cliente.create({ nombre, email, telefono });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al crear cliente" });
  }
};
