// controllers/empleadoController.js
const db = require('../config/db');

// **Obtener empleados (Maestros)**
exports.getEmpleados = (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } else {
            res.json(results);
        }
    });
};
