const express = require('express');
const router = express.Router();
const controller = require('../controller/producttoController');
const multer = require('multer');
const path = require('path');
const upload = require('../uploads/uploads')
const fs = require('fs');  // Asegúrate de importar 'fs' para guardar archivos

// Ruta para listar productos
router.get('/api/productos', upload.single('imagen'),controller.listarProductos);

// Ruta para crear un producto
router.post('/api/productos',upload.single('imagen'), controller.crearProducto);  // Verifica esta ruta

  

// Ruta para obtener un producto por ID
router.get('/api/producto/:id', controller.obtenerProductoId);

// Ruta para editar un producto
router.put('/api/producto/:id', controller.editarProducto);

// Ruta para eliminar un producto
router.delete('/api/producto/:id', controller.eliminarProducto);

// Hacer que los archivos en la carpeta 'uploads' sean accesibles públicamente
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = router;
