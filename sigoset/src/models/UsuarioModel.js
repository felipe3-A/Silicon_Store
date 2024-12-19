const mysql = require('mysql2');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = {
  // Encuentra un usuario por email
  findByEmail: async (email) => {
    try {
      email = email.trim(); // Limpiar espacios antes de la consulta
      const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0]; // Devuelve el primer usuario encontrado
    } catch (error) {
      console.error("Error en findByEmail:", error);
      throw error;
    }
  },

  // Crear un login con email, identificación y contraseña
  createLogin: async (email, identificacion, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
      await pool.execute(
        'INSERT INTO usuarios (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
    } catch (error) {
      console.error("Error en createLogin:", error);
      throw error;
    }
  },

  // Encuentra todos los usuarios
  findAll: async () => {
    try {
      const [rows] = await pool.execute('SELECT * FROM usuarios');
      return rows;
    } catch (error) {
      console.error("Error en findAll:", error);
      throw error;
    }
  },

  // Crea un usuario
  create: async function (UsuarioData) {
    try {
      // Hashear la contraseña antes de ejecutar la consulta
      // const hashedPassword = await bcrypt.hash(UsuarioData.password, 10);

      const sql = `
        INSERT INTO usuarios (nombre, email, identificacion, direccion, telefono, pago, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Ejecutar la consulta
      await pool.execute(sql, [
        UsuarioData.nombre,
        UsuarioData.email,
        UsuarioData.identificacion,
        UsuarioData.direccion,
        UsuarioData.telefono,
        UsuarioData.pago,
        UsuarioData.password
        // hashedPassword // Usamos el hash resuelto
      ]);
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  }
};

// Encuentra un usuario por su ID
async function findByPk(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error("Error en findByPk:", error);
    throw error;
  }
}

// Encuentra un usuario por email (otra implementación)
async function findOneByEmail(email) {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0]; // Asegúrate de que este usuario existe
  } catch (error) {
    console.error("Error en findOneByEmail:", error);
    throw error;
  }
}

// Elimina un usuario por ID
async function deleteById(id) {
  try {
    const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('El usuario no existe');
    }
    return { message: 'Usuario eliminado exitosamente' };
  } catch (error) {
    console.error("Error en deleteById:", error);
    throw error;
  }
}

module.exports = {
  Usuario,
  findOneByEmail,
  deleteById,
  findByPk
};
