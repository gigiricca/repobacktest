const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");
const eventoController = require("../controllers/eventoController");
const menuController = require("../controllers/menuController");
const reservaController = require("../controllers/reservaController");

// Rutas para clientes
router.get("/clientes", clienteController.getAllClientes);
router.post("/clientes", clienteController.createCliente);

// Rutas para eventos
router.get("/eventos", eventoController.getAllEventos);
router.post("/eventos", eventoController.createEvento);

// Rutas para menús
router.get("/menus", menuController.getAllMenus);
router.post("/menus", menuController.createMenu);

// Rutas para reservas
router.get("/reservas", reservaController.getAllReservas);
router.post("/reservas", reservaController.createReserva);

module.exports = router;
