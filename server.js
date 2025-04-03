const express = require("express");
const cors = require("cors");
const empleadoService = require("./src/services/empleadoService");
const administradorService = require("./src/services/administradorService");

// Importa la conexión a la base de datos
const db = require("./src/config/db"); // Asegúrate de que la ruta sea correcta

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8083",
      "http://192.168.21.18:8083",
      "http://192.168.21.18:8084",
    ],
  })
);

// **Rutas para empleados** (sin cambios)
app.get("/empleados", async (req, res) => {
  try {
    const empleados = await empleadoService.obtenerEmpleados();
    res.json(empleados);
  } catch (err) {
    console.error("Error al obtener empleados:", err);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

// **Rutas para administradores** (nuevas)
app.get("/administradores", async (req, res) => {
  try {
    const administradores = await administradorService.obtenerAdministradores();
    res.json(administradores);
  } catch (err) {
    console.error("Error al obtener administradores:", err);
    res.status(500).json({ error: "Error al obtener administradores" });
  }
});

app.post('/api/usuarios_admin', async (req, res) => {
  try {
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, rol, correo, clave } = req.body;

    const adminData = { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, rol, correo, clave };

    const result = await administradorService.agregarAdministrador(adminData); // Llamamos al servicio

    res.status(201).json({ message: 'Administrador agregado correctamente', data: result });
  } catch (err) {
    console.error('Error al agregar el administrador:', err);
    res.status(500).json({ error: 'Error al agregar el administrador' });
  }
});

app.delete('/administradores/:numero_empleado', (req, res) => {
  const { numero_empleado } = req.params;

  // Consulta para eliminar al administrador por número de empleado
  const query = 'DELETE FROM usuarios_admin WHERE numero_empleado = ?';
  db.query(query, [numero_empleado], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error al eliminar el administrador');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Administrador no encontrado');
    }

    res.status(200).send('Administrador eliminado con éxito');
  });
});

// **Iniciar el servidor**
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
