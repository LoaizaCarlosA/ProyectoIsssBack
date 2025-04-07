// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// **Registro de usuario (Administradores)**
exports.register = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, correo, contrasena, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    db.query('INSERT INTO usuarios_admin (nombre, apellido_paterno, apellido_materno, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, rol],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
};

// **Inicio de sesión (Administradores)**
// **Inicio de sesión (Administradores)**
exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    db.query('SELECT * FROM usuarios_admin WHERE correo = ?', [correo], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcrypt.compare(contrasena, results[0].contrasena);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = {
            id: results[0].id,
            nombre: results[0].nombre,
            apellido_paterno: results[0].apellido_paterno,
            apellido_materno: results[0].apellido_materno,
            correo: results[0].correo,
            rol: results[0].rol,
        };

        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
            'secreto',
            { expiresIn: '1h' }
        );

        res.json({ token, usuario }); // 👈 Ahora mandamos también el usuario
    });
};
