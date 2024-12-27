// routes/imagenRoutes.js
const express = require('express');
const router = express.Router();
const ImagenController = require('../controller/imageController'); // Asegúrate de que la ruta sea correcta

// Ruta para subir imágenes
router.post('/upload', ImagenController.uploadImage, ImagenController.crearImagen);
router.get('/upload', ImagenController.listarImagenes)

// Otras rutas como listarImagenes, eliminarImagen, etc.

module.exports = router;