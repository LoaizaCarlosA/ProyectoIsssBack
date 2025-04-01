const express = require('express');
const cors = require('cors');
const connection = require('./db');  // Importamos la conexión a MySQL

const app = express();
const port = 5000;

app.use(cors({  origin: ['http://localhost:8083', 'http://192.168.21.18:8083', 'http://192.168.21.18:8084'] })); // Permitir solicitudes desde el frontend

// Ruta para obtener todos los datos de la tabla `padron_unificado`
app.get('/empleados', (req, res) => {
  connection.query('SELECT * FROM empleados', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error al obtener los datos' });
    } else {
      res.json(results);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
