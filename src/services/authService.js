// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de usuario
async function registrarUsuario(nombre, apellido_paterno, apellido_materno, correo, contrasena, rol) {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios_admin (nombre, apellido_paterno, apellido_materno, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, rol],
            (err) => {
                if (err) reject(err);
                resolve('Usuario registrado correctamente');
            }
        );
    });
}

// Iniciar sesión
async function login(correo, contrasena) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios_admin WHERE correo = ?', [correo], async (err, results) => {
            if (err || results.length === 0) return reject('Credenciales inválidas');
            const isValidPassword = await bcrypt.compare(contrasena, results[0].contrasena);
            if (!isValidPassword) return reject('Credenciales inválidas');
            const token = jwt.sign(
                { id: results[0].id, correo: results[0].correo, rol: results[0].rol },
                'secreto', // Cambia por una clave más segura en producción
                { expiresIn: '1h' }
            );
            resolve(token);
        });
    });
}

module.exports = { registrarUsuario, login };
