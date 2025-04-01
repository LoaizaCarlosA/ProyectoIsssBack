const express = require('express');
const connection = require('./db'); // Conexión a la base de datos
const app = express();
const port = 3000;

app.get('/padron', (req, res) => {
  connection.query('SELECT * FROM empleados', (err, results) => {
    if (err) {
      console.error('Error al obtener datos: ' + err.stack);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results); // Devuelve los resultados como JSON
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
