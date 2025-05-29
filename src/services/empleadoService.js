// services/empleadoService.js
const db = require('../config/db');

// Obtener todos los empleados
async function obtenerEmpleados() {
    try {
        const [rows] = await db.query('SELECT * FROM empleados');
        return rows;
    } catch (err) {
        throw err;
    }
}

// Agregar un nuevo empleado
async function agregarEmpleado(empleado) {
    const { nombre, apellPa, apellMa, rol, telefono, correo } = empleado;
    try {
        await db.query(
            'INSERT INTO empleados (nombre, apellPa, apellMa, rol, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellPa, apellMa, rol, telefono, correo]
        );
        return 'Empleado agregado correctamente';
    } catch (err) {
        throw err;
    }
}

// Eliminar un empleado
async function eliminarEmpleado(id) {
    try {
        await db.query('DELETE FROM empleados WHERE id = ?', [id]);
        return 'Empleado eliminado correctamente';
    } catch (err) {
        throw err;
    }
}

module.exports = { obtenerEmpleados, agregarEmpleado, eliminarEmpleado };
