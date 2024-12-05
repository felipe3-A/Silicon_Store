
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Silicon',
  waitForConnections: true, 
  connectionLimit: 10,
  queueLimit: 0
});


pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) {
    console.error('Error al conectar a MySQL 1 www:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL:', rows[0].solution);
});


module.exports = pool.promise(); // Exporta la pool de conexiones configurada para utilizar promesas
