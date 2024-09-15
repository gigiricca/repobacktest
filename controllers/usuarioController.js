const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const Favorito = require("../models/favorito");
const Producto = require("../models/producto");
const Imagen = require("../models/imagen");
const Caracteristica = require("../models/caracteristica");

exports.crearUsuario = async(req, res) => {
    try {
      const { nombre, apellido, email, password } = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Crear un nuevo usuario
      const nuevoUsuario = await Usuario.create({ nombre, apellido, email, password });

      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el usuario" + error, error });
    }
  };


  exports.login = async(req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar el usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, usuario.password);
      console.log("password: " + password);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      res.json({ 
        id: usuario.id, 
        nombre: usuario.nombre, 
        apellido: usuario.apellido,
        email: usuario.email,
        rolId: usuario.rolId
      });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  };

  exports.obtenerUsuarios = async(req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'apellido', 'email', 'rolId'],
            include: {
                model: Rol,
                attributes: ['nombre'],
            }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

exports.cambiarRol = async(req, res) => {
  try {
      const { id, rolId } = req.body;

      // Verificar si el usuario existe
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualizar el rol del usuario
      usuario.rolId = rolId;
      await usuario.save();

      res.json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
      res.status(500).json({ message: "Error al actualizar el rol del usuario", error });
  }
};

// Marcar o desmarcar producto como favorito
exports.toggleFavorito = async (req, res) => {
  const { usuarioId, productoId } = req.body;

  try {
    // Verificar si ya existe el favorito
    const favoritoExistente = await Favorito.findOne({ where: { usuario_id: usuarioId, producto_id: productoId } });

    if (favoritoExistente) {
      // Si existe, eliminarlo (desmarcar favorito)
      await favoritoExistente.destroy();
      return res.json({ message: "Producto eliminado de favoritos" });
    } else {
      // Si no existe, crear el favorito (marcar como favorito)
      await Favorito.create({ usuario_id: usuarioId, producto_id: productoId });
      return res.json({ message: "Producto agregado a favoritos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al manejar el favorito", error });
  }
};

// Obtener la lista de favoritos del usuario
exports.obtenerFavoritos = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const usuario = await Usuario.findByPk(usuarioId, {
      include: [
        {
          model: Producto, 
          as: 'favoritos',
          include: [
            { model: Imagen, as: 'imagenes' },  // Incluir imágenes del producto si es necesario
            { model: Caracteristica, as: 'caracteristicas' },  // Incluir características del producto si es necesario
          ]
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario.favoritos); // Devuelve la lista completa de productos favoritos
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los favoritos" + error });
  }
};
