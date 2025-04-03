// routes/empleadoRoutes.js
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas para empleados
router.get('/', authMiddleware.verificarToken, empleadoController.getEmpleados);

module.exports = router;
