// controllers/producto.js
const Producto = require("../models/producto");
const Imagen = require("../models/imagen");
const sequelize = require("../config/database");

exports.getAllProductos = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query; // Parámetros de consulta con valores predeterminados
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await Producto.findAndCountAll({
      include: [{ model: Imagen, as: 'imagenes' }],
      limit,
      offset,
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      productos: rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos " + error });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, { include: [{ model: Imagen, as: 'imagenes' }] });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto " + error });
  }
};

exports.createProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nombre, descripcion, categoria_id, precio, imagenes } = req.body;

    const producto = await Producto.create({ nombre, descripcion, categoria_id, precio }, { transaction: t });

    if (imagenes && imagenes.length > 0) {
      const imagenPromises = imagenes.map(url => Imagen.create({ url, productoId: producto.id }, { transaction: t }));
      await Promise.all(imagenPromises);
    }

    await t.commit();
    res.status(201).json(producto);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error al crear producto" });
  }
};

exports.deleteProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, { transaction: t });

    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await Imagen.destroy({ where: { productoId: id }, transaction: t });
    await producto.destroy({ transaction: t });

    await t.commit();
    res.status(204).send(); // No Content
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error al borrar producto" });
  }
};

exports.updateProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria_id, precio, imagenes } = req.body;

    const producto = await Producto.findByPk(id, { transaction: t });

    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.update({ nombre, descripcion, categoria_id, precio }, { transaction: t });

    if (imagenes && imagenes.length > 0) {
      await Imagen.destroy({ where: { productoId: id }, transaction: t });
      const imagenPromises = imagenes.map(url => Imagen.create({ url, productoId: id }, { transaction: t }));
      await Promise.all(imagenPromises);
    }

    await t.commit();
    res.json(producto);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};
