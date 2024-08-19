const bcrypt = require("bcrypt");
const Administrador = require("../models/administrador");

  exports.adminLogin = async(req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar el administrador por email
      const administrador = await Administrador.findOne({ where: { email } });
      if (!administrador) {
        return res.status(400).json({ message: "Administrador no encontrado" });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, administrador.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      res.json({ 
        id: administrador.id, 
        nombre: administrador.nombre, 
        apellido: administrador.apellido,
        email: administrador.email
      });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  };
