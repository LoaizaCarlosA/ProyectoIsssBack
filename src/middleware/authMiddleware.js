// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Acceso denegado' });

    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = decoded;
        next();
    });
};
