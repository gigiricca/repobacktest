const Categoria = require("../models/categoria");
const sequelize = require("../config/database"); // Importar sequelize

// Obtener todas las categorías
exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías " + error });
  }
};

// Crear una categoría
exports.createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const categoria = await Categoria.create({ nombre });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

// Actualizar una categoría
exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoria.update({ nombre });

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

// Borrar una categoría
exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoria.destroy();

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: "Error al borrar categoría" });
  }
};
