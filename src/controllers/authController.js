const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

// **Registro de usuario (Administradores)**
exports.register = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, correo, contrasena, rol } = req.body;
    console.log('Registrando usuario con contraseña:', contrasena); // 🔍

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log('Contraseña encriptada:', hashedPassword); // 🔍

        db.query('INSERT INTO usuarios_admin (nombre, apellido_paterno, apellido_materno, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, rol],
            (err) => {
                if (err) {
                    console.error('Error en el registro:', err);
                    return res.status(500).json({ error: 'Error al registrar el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado correctamente' });
            });
    } catch (err) {
        console.error('Error al encriptar la contraseña:', err);
        res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }
};

// **Inicio de sesión (Administradores)**
exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    db.query('SELECT * FROM usuarios_admin WHERE correo = ?', [correo], async (err, results) => {
        if (err || results.length === 0) {
            console.error('Credenciales inválidas:', err);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        try {
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
                temporal: results[0].temporal,
            };

            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
                'secreto',
                { expiresIn: '1h' }
            );

            res.json({ token, usuario }); // 👈 Ahora mandamos también el usuario
        } catch (err) {
            console.error('Error al comparar contraseñas:', err);
            res.status(500).json({ error: 'Error al verificar la contraseña' });
        }
    });
};

// **Actualizar contraseña**
exports.actualizarPassword = async (req, res) => {
    const { id, nuevaContrasena } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        db.query('UPDATE usuarios_admin SET contrasena = ? WHERE id = ?', [hashedPassword, id], (err) => {
            if (err) {
                console.error('Error al actualizar la contraseña:', err);
                return res.status(500).json({ error: 'Error al actualizar la contraseña' });
            }
            res.json({ message: 'Contraseña actualizada correctamente' });
        });
    } catch (err) {
        console.error('Error al encriptar la nueva contraseña:', err);
        res.status(500).json({ error: 'Error al encriptar la nueva contraseña' });
    }
};

// **Recuperación de contraseña (forgot-password)**
exports.forgotPassword = async (req, res) => {
    const { correo } = req.body;

    db.query('SELECT * FROM usuarios_admin WHERE correo = ?', [correo], async (err, results) => {
        if (err || results.length === 0) {
            console.error('Usuario no encontrado:', err);
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        try {
            // Generar contraseña temporal
            const nuevaContrasena = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

            // Guardar contraseña temporal y marcar campo temporal = 1
            db.query('UPDATE usuarios_admin SET contrasena = ?, temporal = 1 WHERE correo = ?', [hashedPassword, correo], async (updateErr) => {
                if (updateErr) {
                    console.error('Error al guardar la contraseña temporal:', updateErr);
                    return res.status(500).json({ success: false, message: 'Error al guardar la contraseña temporal' });
                }

                // Enviar correo con la nueva contraseña temporal
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'carlos.andres.loaiza52@gmail.com',
                        pass: 'yieh yccp ygwq kpvc', // Usa un token seguro, no tu contraseña normal
                    },
                });

                const mailOptions = {
                    from: 'tu-correo@gmail.com',
                    to: correo,
                    subject: 'Contraseña temporal',
                    text: `Tu nueva contraseña temporal es: ${nuevaContrasena}\nPor seguridad, cámbiala al iniciar sesión.`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    res.json({ success: true, message: 'Contraseña enviada por correo' });
                } catch (mailError) {
                    console.error('Error al enviar el correo:', mailError);
                    res.status(500).json({ success: false, message: 'No se pudo enviar el correo' });
                }
            });
        } catch (err) {
            console.error('Error al generar la nueva contraseña:', err);
            res.status(500).json({ success: false, message: 'Error al generar la nueva contraseña' });
        }
    });
};
