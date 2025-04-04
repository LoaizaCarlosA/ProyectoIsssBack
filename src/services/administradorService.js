// src/services/administradorService.js
const connection = require("../config/db"); // Importamos la conexión a la base de datos

// Función para obtener todos los administradores
const obtenerAdministradores = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT id, nombre, apellido_paterno, apellido_materno, correo, rol, numero_empleado, contrasena, fecha_creacion FROM usuarios_admin";

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Incluir numero_empleado en los resultados
      }
    });
  });
};

// Función para agregar un nuevo administrador
// Función para agregar un nuevo administrador
const agregarAdministrador = (adminData) => {
  return new Promise((resolve, reject) => {
    const {
      numeroEmpleado,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rol,
      correo,
      clave,
    } = adminData;

    // Asegurarnos de que los valores de apellidoPaterno y apellidoMaterno no sean undefined
    const apellidoPaternoFinal = apellidoPaterno
      ? apellidoPaterno
      : "No Apellido Paterno";
    const apellidoMaternoFinal = apellidoMaterno
      ? apellidoMaterno
      : "No Apellido Materno";

    console.log("Datos recibidos en el backend:", adminData); // Verificar los datos recibidos

    // Verificar que numeroEmpleado es un número válido
    if (!numeroEmpleado || isNaN(numeroEmpleado) || numeroEmpleado <= 0) {
      return reject("Número de empleado no válido.");
    }

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
      clave,
    ];

    console.log("Consulta SQL:", query);
    console.log("Valores para la consulta:", values);

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error en la inserción:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// src/services/administradorService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Asegúrate de que la ruta sea correcta

// Función de login para administradores
const login = (correo, contrasena) => {
  return new Promise((resolve, reject) => {
    // Consultamos la base de datos para obtener el administrador
    db.query(
      "SELECT * FROM usuarios_admin WHERE correo = ?",
      [correo],
      async (err, results) => {
        if (err || results.length === 0) {
          return reject("Credenciales inválidas");
        }

        // Comparamos la contraseña ingresada con la almacenada (encriptada)
        const isValidPassword = await bcrypt.compare(
          contrasena,
          results[0].contrasena
        );
        if (!isValidPassword) {
          return reject("Credenciales inválidas");
        }

        // Si las credenciales son correctas, generamos un token
        const token = jwt.sign(
          { id: results[0].id, correo: results[0].correo, rol: results[0].rol },
          "secreto",
          { expiresIn: "1h" }
        );
        resolve(token); // Devolvemos el token generado
      }
    );
  });
};

module.exports = {
  login,
  obtenerAdministradores,
  agregarAdministrador,
};
