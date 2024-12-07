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


appSigoSet.use(productosRoutes)



appSigoSet.set("port", process.env.PORT || port);

module.exports = appSigoSet;
