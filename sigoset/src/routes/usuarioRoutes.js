// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const {crearUsuarioC,
     obtenerUsuariosC,
     postLogin,
     editarUsuarioC,
     eliminarUsuarioC,
     cambiarContraseñaC,
     solicitarRestablecimiento,
      restablecerContraseña,
      estadoUsuarioC,
      cerrarSesionC,
      getUserId,
      enviarDatosUsuarioPorCorreoController
     } = require('../controller/usuarioController');


module.exports = router;
