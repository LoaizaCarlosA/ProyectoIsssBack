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
        const apellidoPaternoFinal = apellidoPaterno ? apellidoPaterno : "No Apellido Paterno"; 
        const apellidoMaternoFinal = apellidoMaterno ? apellidoMaterno : "No Apellido Materno"; 

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
                console.error('Error en la inserción:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
  

module.exports = {
  obtenerAdministradores,
  agregarAdministrador,
};
