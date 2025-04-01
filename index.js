const db = require('./db');

db.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) throw err;
    console.log('Prueba de conexión:', results[0].resultado);
    db.end();
});
