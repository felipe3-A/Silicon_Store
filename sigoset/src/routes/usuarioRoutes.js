const express = require("express");
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
  cerrarSesionC
} = require("../controller/UsuarioController");
const validarTokenMiddleware = require('../middleware/VerificadorToken')

const { postLogin } = require('../controller/UsuarioController');
// Rutas
router.post("/usuarios", crearUsuario);
router.get("/usuarios", validarTokenMiddleware, obtenerUsuarios);
router.post("/login",postLogin );
router.put("/usuarios/:id", editarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);
router.post('/cerrarSesion', cerrarSesionC);



module.exports = router;
