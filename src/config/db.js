// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LoaizaIsssteesin',  // Ajusta tus credenciales
    database: 'mi_sistema'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

module.exports = db;
