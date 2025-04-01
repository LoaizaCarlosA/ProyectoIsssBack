const mysql = require('mysql2');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Cambia si tu base de datos está en otro host
  user: 'root', // Tu usuario de MySQL
  password: 'LoaizaIsssteesin', // Tu contraseña de MySQL
  database: 'mi_sistema', // El nombre de tu base de datos
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

module.exports = connection;
