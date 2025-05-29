const mysql = require('mysql2'); // Cambiar a mysql2
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "192.168.21.105",  // Usamos la IP configurada en el .env
  user: process.env.DB_USER || "CarlosLoazia",
  password: process.env.DB_PASSWORD || "C0ntr4s3ñ4_S3gur4_1!",  // Ajusta las credenciales
  database: process.env.DB_NAME || "mi_sistema"
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
});

module.exports = db;
