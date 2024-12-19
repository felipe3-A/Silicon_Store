const {
  Usuario,
  findOneByEmail,
  deleteById,
  findByPk,
} = require("../models/UsuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const nodemailer = require("nodemailer");

const {listaNegraService} = require('./listaNegraService')


require("dotenv").config(); // Es importante agregar los paréntesis para que se ejecute correctamente

async function crearUsuario(UsuarioData) {
  try {
    if (
      !UsuarioData.nombre ||
      !UsuarioData.email ||
      !UsuarioData.identificacion ||
      !UsuarioData.direccion ||
      !UsuarioData.telefono ||
      !UsuarioData.password ||
      !UsuarioData.pago
    ) {
      throw new Error("Faltan datos del usuario");
    }

    const defaultPassword = UsuarioData.identificacion;
    if (!defaultPassword) {
      throw new Error("Identificacion no Proporcionada");
    }

    if (!UsuarioData.password || UsuarioData.password.trim() === "") {
      throw new Error("El campo contraseña es obligatorio.");
    }

    const hashedPassword = await bcrypt.hash(UsuarioData.password, 12);
    UsuarioData.password = hashedPassword;

    const nuevoUsuario = await Usuario.create(UsuarioData);
    return nuevoUsuario;
  } catch (error) {
    throw error;
  }
}

const obtenerUsuarios = async () => {
  try {
    const usuarios = await Usuario.findAll();
    return usuarios;
  } catch (error) {
    throw error;
  }
};

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "El correo electrónico y la contraseña son requeridos" });
    }

    console.log("Email recibido:", email);

    const user = await findOneByEmail(email);

    if (!user) {
      console.log("Usuario no encontrado para el email:", email);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("La contraseña no coincide para el usuario:", email);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userData } = user; // Excluye el password

    res.json({
      success: "Inicio de sesión correcto",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


const cerrarSesion = async (token) => {
  try {
    // Agregar el token a la lista negra
    await listaNegraService.agregarToken(token);
    return { message: 'Sesión cerrada exitosamente' };
  } catch (error) {
    throw error;
  }
}


async function editarUsuario(id, nuevoUsuarioData) {
  try {
    // Verifica si el usuario existe
    const [usuarioExistente] = await pool.execute(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );

    if (!usuarioExistente.length) {
      throw new Error("El usuario no existe");
    }

    // Actualiza los datos del usuario
    const [result] = await pool.execute(
      "UPDATE usuarios SET nombre = ?, email = ?, identificacion = ?, direccion = ?, telefono = ?, pago = ? WHERE id = ?",
      [
        nuevoUsuarioData.nombre,
        nuevoUsuarioData.email,
        nuevoUsuarioData.identificacion,
        nuevoUsuarioData.direccion,
        nuevoUsuarioData.telefono,
        nuevoUsuarioData.pago,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el usuario");
    }

    // Retorna el usuario actualizado
    return { id, ...nuevoUsuarioData };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function eliminarUsuario(id) {
  try {
    await deleteById(id);
    return { message: "Usuario eliminado exitosamente" };
  } catch (error) {
    throw error;
  }
}

//listar usuario por id
const getUserById = async (id) => {
  try {
    const user = await findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Seleccionar solo los campos deseados del usuario
    const { nombre, email, identificacion, direccion, telefono, pago } = user;

    return { nombre, email, identificacion, direccion, telefono, pago };
  } catch (error) {
    throw new Error("Error al obtener el usuario por ID: " + error.message);
  }
};

module.exports = {
  obtenerUsuarios,
  loginUser,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  getUserById,
  cerrarSesion
};
