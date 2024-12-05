const Productos = require('../models/ProductModel');

const crearProducto = async (ProductoData) => {
  try {
    const [result] = await Productos.create(ProductoData); // Crear el producto
    return result;  // Retorna el resultado de la creación
  } catch (error) {
    throw new Error('Error al guardar el producto: ' + error.message);
  }
};

const obtenerProductoId = async (idProducto) => {
  try {
    const producto = await Productos.findById(idProducto);  // Obtener producto por ID
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;  // Retorna el producto encontrado
  } catch (error) {
    throw error;
  }
};

const listarProductos = async () => {
  try {
    const [productos] = await Productos.findAll();  // Listar productos
    return productos;
  } catch (error) {
    throw error;
  }
};

const editarProducto = async (id, nuevoProducto) => {
  try {
    const [result] = await Productos.update(id, nuevoProducto);  // Actualizar producto
    return result;
  } catch (error) {
    throw error;
  }
};

const eliminarProducto = async (id) => {
  try {
    const [result] = await Productos.deleteById(id);  // Eliminar producto por ID
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearProducto,
  obtenerProductoId,
  eliminarProducto,
  editarProducto,
  listarProductos
};
