// services/empleadoService.js
const db = require('../config/db');

// Obtener todos los empleados
function obtenerEmpleados() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM empleados', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

// Agregar un nuevo empleado
function agregarEmpleado(empleado) {
    return new Promise((resolve, reject) => {
        const { nombre, apellPa, apellMa, rol, telefono, correo } = empleado;
        db.query(
            'INSERT INTO empleados (nombre, apellPa, apellMa, rol, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellPa, apellMa, rol, telefono, correo],
            (err) => {
                if (err) reject(err);
                resolve('Empleado agregado correctamente');
            }
        );
    });
}

// Eliminar un empleado
function eliminarEmpleado(id) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM empleados WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            resolve('Empleado eliminado correctamente');
        });
    });
}

module.exports = { obtenerEmpleados, agregarEmpleado, eliminarEmpleado };
