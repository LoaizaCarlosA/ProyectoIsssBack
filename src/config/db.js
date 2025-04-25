const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",  // Usamos la IP configurada en el .env
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "LoaizaIsssteesin",  // Ajusta las credenciales
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
