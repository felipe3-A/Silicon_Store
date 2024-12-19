const {
  Usuario,
  obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
  crearUsuario,
  cerrarSesion,
  loginUser, // Asegúrate de incluir esta función
} = require("../services/usuarioService");

const bcrypt = require('bcrypt'); // Para manejar el cifrado de contraseñas

const { findOneByEmail } = require("../models/UsuarioModel");

const controller = {};

// Crear usuario
controller.crearUsuario = async (req, res, next) => {
  try {
    const UsuarioData = req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await findOneByEmail(UsuarioData.email);
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "El correo electrónico ya está registrado",
      });
    }

    // Crear el usuario
    const usuario = await crearUsuario(UsuarioData);
    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

// Obtener usuarios
controller.obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.status(200).json({
      message: "Usuarios listados correctamente",
      data: usuarios,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "No se obtuvieron los usuarios",
      error: error.message,
    });
  }
};

// Editar usuario
controller.editarUsuario = async (req, res) => {
  try {
    const id = req.params.id; // ID del usuario a editar
    const nuevoUsuarioData = req.body; // Datos nuevos del usuario

    const usuarioActualizado = await editarUsuario(id, nuevoUsuarioData);

    res.status(200).json({
      message: "Usuario editado exitosamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Error al editar usuario",
      error: error.message,
    });
  }
};

// Eliminar usuario
controller.eliminarUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.params.id;
    await eliminarUsuario(idUsuario);
    res.status(200).json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "No se encontró ningún usuario con el ID proporcionado",
      error: error.message,
    });
  }
};

//Login de usuario
controller.postLogin = async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

controller.cerrarSesionC = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
     return res.status(401).json({ status: 401, error: 'No se proporcionó un token de autenticación' });
   }
 
    const token = req.headers['authorization']; // Obtener el token del encabezado de la solicitud
 
    // Llamar al servicio de cierre de sesión
    await cerrarSesion(token);
 
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
   } catch (error) {
     next(error);
   }
 };
 







module.exports = controller;
