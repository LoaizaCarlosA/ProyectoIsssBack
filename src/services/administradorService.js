const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // ya es un pool con mysql2/promise

// Obtener todos los administradores
const obtenerAdministradores = async () => {
  try {
    const [rows] = await db.query(`
      SELECT id, nombre, apellido_paterno, apellido_materno, correo, rol, numero_empleado, contrasena, fecha_creacion 
      FROM usuarios_admin
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Agregar nuevo administrador
const agregarAdministrador = async (adminData) => {
  const {
    numeroEmpleado,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    rol,
    correo,
    clave,
  } = adminData;

  const apellidoPaternoFinal = apellidoPaterno || "No Apellido Paterno";
  const apellidoMaternoFinal = apellidoMaterno || "No Apellido Materno";

  if (!numeroEmpleado || isNaN(numeroEmpleado) || numeroEmpleado <= 0) {
    throw new Error("Número de empleado no válido.");
  }

  const hashedPassword = await bcrypt.hash(clave, 10);

  const query = `
    INSERT INTO usuarios_admin (numero_empleado, nombre, apellido_paterno, apellido_materno, rol, correo, contrasena)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    numeroEmpleado,
    nombre,
    apellidoPaternoFinal,
    apellidoMaternoFinal,
    rol,
    correo,
    hashedPassword,
  ];

  try {
    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

// Login administrador
const login = async (correo, contrasena) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM usuarios_admin WHERE correo = ?",
      [correo]
    );

    if (results.length === 0) {
      throw new Error("Credenciales inválidas");
    }

    const usuario = results[0];
    const isValidPassword = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isValidPassword) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      "secreto",
      { expiresIn: "1h" }
    );

    const { contrasena: _, ...usuarioSinPassword } = usuario;
    return { token, usuario: usuarioSinPassword };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  obtenerAdministradores,
  agregarAdministrador,
};
