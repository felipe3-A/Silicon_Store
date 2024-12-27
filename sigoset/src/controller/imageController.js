const ImagenService = require("../services/imagenService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear carpeta si no existe
const imagePath = path.join(__dirname, "../../images");
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: imagePath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const controller = {};

controller.uploadImage = upload.single("image");

controller.crearImagen = async (req, res) => {
  try {
    const {
      tipo_imagen,
      categoria_imagen,
      nombre_producto,
      precio_producto,
      descripcion_producto,
      categoria_producto,
      cantidad_producto,
      referencia_producto,
      garantia_producto,
      marca_producto,
      envio_producto,
    } = req.body;

    const url_imagen = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    if (!req.file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }

   

    const nuevaImagen = {
      url_imagen: url_imagen || null,
      nombre_producto: nombre_producto || null,
      precio_producto: precio_producto || null,
      descripcion_producto: descripcion_producto || null,
      categoria_producto: categoria_producto || null,
      cantidad_producto: cantidad_producto || null,
      referencia_producto: referencia_producto || null,
      garantia_producto: garantia_producto || null,
      marca_producto: marca_producto || null,
      envio_producto: envio_producto || null,
    };
    

    // Llama al servicio para guardar la imagen en la base de datos
    const result = await ImagenService.crearImagen(nuevaImagen);

    res.status(201).json({
      message: "Imagen creada exitosamente",
      data: { id: result.insertId, ...nuevaImagen },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la imagen", error: error.message });
  }
};

controller.listarImagenes = async (req, res) => {
  try {
    const imageneslist = await ImagenService.listarImagenes();
    if (!imageneslist || imageneslist.length === 0) {
      return res.status(404).json({ message: "No se encontraron imágenes." });
    }
    res.status(200).json({
      message: "Imágenes listadas correctamente",
      data: imageneslist,
    });
  } catch (error) {
    res.status(500).json({
      message: "No se pudo listar las imágenes",
      error: error.message,
    });
  }
};

module.exports = controller;
