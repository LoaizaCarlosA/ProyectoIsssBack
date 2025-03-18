const express = require('express');
const router = express.Router();

// Datos de prueba (esto se puede conectar a una BD después)
const usuarios = [
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' },
  { id: 3, nombre: 'Carlos' },
  { id: 4, nombre: 'María' },
];

router.get('/', (req, res) => {
  res.json(usuarios);
});

module.exports = router;
