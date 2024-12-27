const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const path = require('path');
const multer= require('multer')


const appSigoSet = express();
const port = 3000;  // O el puerto que desees
appSigoSet.use(cors());


appSigoSet.use(express.json());
appSigoSet.use(morgan("dev"));


const productosRoutes = require("../routes/productoRoutes"); // Asegúrate de que exista y sea correcto
const usuariosRoutes = require("../routes/usuarioRoutes")
const imageRoutes = require("../routes/imageRoutes")

appSigoSet.use(productosRoutes)
appSigoSet.use(usuariosRoutes)
appSigoSet.use('/api/imagenes', imageRoutes);
appSigoSet.use("/uploads", express.static(path.join(__dirname, "../../images")));


appSigoSet.set("port", process.env.PORT || port);

module.exports = appSigoSet;
