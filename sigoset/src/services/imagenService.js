// services/imagenService.js
const db = require('../config/database'); // Asegúrate de tener tu conexión a la base de datos
const Imagenes = require('../models/imageModels')


const crearImagen = async (imagen) => {
    const query = `
      INSERT INTO imagenes (
        url_imagen,
        nombre_producto,
        precio_producto,
        descripcion_producto,
        categoria_producto,
        cantidad_producto,
        referencia_producto,
        garantia_producto,
        marca_producto,
        envio_producto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
        imagen.url_imagen || null,
        imagen.nombre_producto || null,
        imagen.precio_producto || null,
        imagen.descripcion_producto || null,
        imagen.categoria_producto || null,
        imagen.cantidad_producto || null,
        imagen.referencia_producto || null,
        imagen.garantia_producto || null,
        imagen.marca_producto || null,
        imagen.envio_producto || null,
      ];
      
    const [result] = await db.execute(query, values);
    return result;
  };

const listarImagenes = async ()=>{
    try {
        const [imagenes] = await Imagenes.findAll();
        return imagenes;
    } catch (error) {
        throw error;

    }
}

module.exports = {
    crearImagen,
    listarImagenes
};