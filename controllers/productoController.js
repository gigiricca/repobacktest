// controllers/producto.js
const Producto = require("../models/producto");
const Imagen = require("../models/imagen");
const Usuario = require("../models/usuario");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");
const Caracteristica = require("../models/caracteristica");
const { Op } = require('sequelize');

exports.getAllProductos = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, random = false } = req.query; // Parámetros de consulta con valores predeterminados
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const order = random ? Sequelize.literal("RAND()") : [["id", "ASC"]]; // Ordenar aleatoriamente si random es verdadero

    const { count, rows } = await Producto.findAndCountAll({
      include: [{ model: Imagen, as: "imagenes" }],
      limit,
      offset,
      order: [order], // Aplicar el orden correspondiente
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
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Imagen, as: "imagenes" },
        { model: Caracteristica, as: "caracteristicas" },
      ],
    });

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
    const { nombre, descripcion, categoria_id, precio, imagenes, caracteristicas, keywords } = req.body;

    // Verificar si el usuario es administrador
    const userId = req.headers['x-user-id'];
    const usuario = await Usuario.findByPk(userId);
    if (usuario.rolId !== 1) {
      await t.rollback();
      return res.status(403).json({ error: "Acceso denegado. Requiere rol de administrador." });
    }
    
    // Verificar si el nombre ya existe
    const existingProducto = await Producto.findOne({ where: { nombre } });
    if (existingProducto) {
      await t.rollback();
      return res.status(400).json({ error: "El nombre del producto ya está en uso" });
    }

    // Crear el producto con keywords
    const producto = await Producto.create(
      { nombre, descripcion, categoria_id, precio, keywords }, // Incluyendo keywords
      { transaction: t }
    );

    // Crear las imágenes asociadas al producto
    if (imagenes && imagenes.length > 0) {
      const imagenPromises = imagenes.map((url) =>
        Imagen.create({ url, productoId: producto.id }, { transaction: t })
      );
      await Promise.all(imagenPromises);
    }

    // Asociar características al producto
    if (caracteristicas && caracteristicas.length > 0) {
      const caracteristicaPromises = caracteristicas.map(({ id, valor }) =>
        producto.addCaracteristica(id, { through: { valor }, transaction: t })
      );
      await Promise.all(caracteristicaPromises);
    }

    await t.commit();
    res.status(201).json(producto);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error al crear producto: " + error });
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
    res.status(500).json({ error: "Error al borrar producto: "+error });
  }
};

exports.updateProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      categoria_id,
      precio,
      imagenes,
      caracteristicas,
      keywords,
    } = req.body;

    const producto = await Producto.findByPk(id, { transaction: t });

    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizar el producto
    await producto.update(
      { nombre, descripcion, categoria_id, precio, keywords },
      { transaction: t }
    );

    // Actualizar las imágenes del producto
    if (imagenes && imagenes.length > 0) {
      await Imagen.destroy({ where: { productoId: id }, transaction: t });
      const imagenPromises = imagenes.map((url) =>
        Imagen.create({ url, productoId: id }, { transaction: t })
      );
      await Promise.all(imagenPromises);
    }

    // Actualizar las características del producto
    if (caracteristicas && caracteristicas.length > 0) {
      await Caracteristica.destroy({
        where: { productoId: id },
        transaction: t,
      });
      const caracteristicaPromises = caracteristicas.map(
        ({ nombre, valor, icono }) =>
          Caracteristica.create(
            { nombre, valor, icono, productoId: id },
            { transaction: t }
          )
      );
      await Promise.all(caracteristicaPromises);
    }

    await t.commit();
    res.json(producto);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: "Error al actualizar producto" + error });
  }
};

exports.searchProductos = async (req, res) => {
  try {
    const { query } = req.query; // Se espera un parámetro de consulta llamado "query"

    // Crear una condición de búsqueda que busque en los campos nombre, descripción y keywords
    const whereCondition = {
      [Op.or]: [
        { nombre: { [Op.like]: `%${query}%` } },
        { descripcion: { [Op.like]: `%${query}%` } },
        { keyword: { [Op.like]: `%${query}%` } },
      ],
    };

    // Buscar productos que cumplan con la condición
    const productos = await Producto.findAll({
      where: whereCondition,
      include: [
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, as: 'caracteristicas' },
      ],
    });

    // Devolver los productos encontrados
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar productos: ' + error });
  }
};

exports.getDistinctKeywords = async (req, res) => {
  try {
    const { query } = req.query;

    // Buscar productos que coincidan con la query
    const productos = await Producto.findAll({
      where: {
        keyword: {
          [Op.like]: `%${query}%` // Usar iLike para búsqueda insensible a mayúsculas/minúsculas
        }
      }
    });

    // Extraer y deduplicar las keywords
    const allKeywords = productos.flatMap(producto => producto.keyword.split(','));
    const distinctKeywords = [...new Set(allKeywords)];

    res.json({ keywords: distinctKeywords });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener keywords: " + error });
  }
};

