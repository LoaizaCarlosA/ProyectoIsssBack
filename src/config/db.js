const mysql = require('mysql2/promise'); // Usamos mysql2 con soporte de promesas
require('dotenv').config();

// Creamos un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || "192.168.21.105",
  user: process.env.DB_USER || "CarlosLoaiza",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "mi_sistema",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Conectando con usuario:", process.env.DB_USER);
console.log("Conectando con contraseña:", process.env.DB_PASSWORD);
console.log("Conectando a host:", process.env.DB_HOST);

module.exports = pool;
