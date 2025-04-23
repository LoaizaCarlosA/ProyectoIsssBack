const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rutas de autenticación
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/change-password", authController.actualizarPassword);

module.exports = router;
