const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");
const categoriaController = require('../controllers/categoriaController.js');

// Rutas para productos
router.get("/productos", productoController.getAllProductos); //Query params page y pageSize
router.get('/productos/:id', productoController.getProductoById); 
router.post("/productos", productoController.createProducto);
router.put('/productos/:id', productoController.updateProducto);
router.delete('/productos/:id', productoController.deleteProducto);

router.get('/categorias', categoriaController.getAllCategorias);
router.post('/categorias', categoriaController.createCategoria);
router.put('/categorias/:id', categoriaController.updateCategoria);
router.delete('/categorias/:id', categoriaController.deleteCategoria);

module.exports = router;
