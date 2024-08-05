const Menu = require("../models/menu");

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener menús" });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const menu = await Menu.create({ nombre, descripcion, precio });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: "Error al crear menú" });
  }
};
