const express = require('express');
const router = express.Router();
const controller = require('../controller/producttoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Asegúrate de importar 'fs' para guardar archivos

// Configuración de Multer para las imágenes
// const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
    // cb(null, 'uploads/');  // Carpeta donde se almacenan las imágenes
  // },
  // filename: function (req, file, cb) {
  //   cb(null, Date.now() + path.extname(file.originalname));  // Nombre único de la imagen con timestamp
  // },
// });

// const upload = multer({ storage: storage });

// Ruta para listar productos
router.get('/api/productos', controller.listarProductos);

// Ruta para crear un producto
router.post('/api/productos', controller.crearProducto);  // Verifica esta ruta

  

// Ruta para obtener un producto por ID
router.get('/api/producto/:id', controller.obtenerProductoId);

// Ruta para editar un producto
router.put('/api/producto/:id', controller.editarProducto);

// Ruta para eliminar un producto
router.delete('/api/producto/:id', controller.eliminarProducto);

// Hacer que los archivos en la carpeta 'uploads' sean accesibles públicamente
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = router;
