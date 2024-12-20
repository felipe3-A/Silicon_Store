const pool = require('../config/database'); // Asegúrate de que pool esté configurado correctamente en tu archivo 'database.js'

const Productos = {
  // Listar todos los productos
  findAll: function () {
    return pool.execute('SELECT * FROM productos');
  },

  // Obtener un producto por su ID
  findById: function (id) {
    return pool.execute('SELECT * FROM productos WHERE id = ?', [id])
      .then(([rows]) => {
        if (rows.length === 0) return null; // Si no se encuentra el producto, devuelve null
        return rows[0];  // Retorna el producto encontrado
      });
  },
  
  // Crear un producto
  create: function (ProductoData) {
    const sql = 'INSERT INTO productos (nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?)';
    return pool.execute(sql, [ProductoData.nombre, ProductoData.precio, ProductoData.descripcion, ProductoData.imagen]);
  },
  
  // Actualizar un producto por su ID
  update: function (id, ProductoData) {
    const precio = parseFloat(ProductoData.precio);
    if (isNaN(precio)) {
      throw new Error('El precio no es un número válido');
    }
  
    const sql = 'UPDATE productos SET nombre= ?, precio= ?, descripcion= ?, imagen= ? WHERE id= ?';
    return pool.execute(sql, [
      ProductoData.nombre,
      precio,
      ProductoData.descripcion,
      ProductoData.imagen,
      id
    ]);
  },
  
  // Eliminar un producto por su ID
  deleteById: function (id) {
    return pool.execute('DELETE FROM productos WHERE id=?', [id]);
  }
};

module.exports = Productos;
