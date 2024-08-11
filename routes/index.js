const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");
const categoriaController = require('../controllers/categoriaController.js');
const usuarioController = require('../controllers/usuarioController.js');

// Rutas para productos
router.get("/productos", productoController.getAllProductos); //Query params page y pageSize
router.get('/productos/:id', productoController.getProductoById); 
router.post("/productos", productoController.createProducto);
router.put('/productos/:id', productoController.updateProducto);
router.delete('/productos/:id', productoController.deleteProducto);

// Rutas para categorias
router.get('/categorias', categoriaController.getAllCategorias);
router.post('/categorias', categoriaController.createCategoria);
router.put('/categorias/:id', categoriaController.updateCategoria);
router.delete('/categorias/:id', categoriaController.deleteCategoria);

// Rutas para usuarios
router.post('/register', usuarioController.crearUsuario);
router.post('/login', usuarioController.login);


module.exports = router;
