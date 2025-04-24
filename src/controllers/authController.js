const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const nodemailer = require("nodemailer");

// **Registro de usuario (Administradores)**
exports.register = async (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    contrasena,
    rol,
  } = req.body;
  console.log("➡️ Registrando usuario:", correo);

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    db.query(
      "INSERT INTO usuarios_admin (nombre, apellido_paterno, apellido_materno, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, rol],
      (err) => {
        if (err) {
          console.error("❌ Error en el registro:", err);
          return res
            .status(500)
            .json({ error: "Error al registrar el usuario" });
        }
        res.status(201).json({ message: "Usuario registrado correctamente" });
      }
    );
  } catch (err) {
    console.error("❌ Error al encriptar la contraseña:", err);
    res.status(500).json({ error: "Error al encriptar la contraseña" });
  }
};

// **Inicio de sesión (Administradores)**
// **Inicio de sesión (Administradores)**
exports.login = (req, res) => {
  const { correo, contrasena } = req.body;

  console.log("➡️ Intentando login con:", correo);

  db.query(
    "SELECT * FROM usuarios_admin WHERE correo = ?",
    [correo],
    async (err, results) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      if (results.length === 0) {
        console.error("Usuario no encontrado");
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      try {
        const isValidPassword = await bcrypt.compare(
          contrasena,
          results[0].contrasena
        );
        console.log("🔐 Contraseña válida:", isValidPassword);
        if (!isValidPassword) {
          return res.status(401).json({ error: "Credenciales inválidas" });
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

        // Verificar si la contraseña es temporal
        if (usuario.temporal === 1) {
          return res
            .status(401)
            .json({
              error:
                "Has iniciado sesión con una contraseña temporal. Por favor, cámbiala.",
            });
        }

        const token = jwt.sign(
          { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
          "secreto",
          { expiresIn: "1h" }
        );
        console.log("🔑 Token generado:", token);

        res.json({ token, usuario });
      } catch (err) {
        console.error("Error al comparar contraseñas:", err);
        res.status(500).json({ error: "Error al verificar la contraseña" });
      }
    }
  );
};

// **Actualizar contraseña**
exports.actualizarPassword = async (req, res) => {
    const { nuevaContrasena } = req.body;
    const id = req.id; // Obtiene el id del token
  
    console.log("ID del usuario a actualizar:", id);
    console.log("Contraseña proporcionada:", nuevaContrasena);
  
    try {
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
      console.log("Contraseña encriptada:", hashedPassword);
  
      db.query(
        "UPDATE usuarios_admin SET contrasena = ?, temporal = 0 WHERE id = ?",
        [hashedPassword, id], // Usa el id del token
        (err, result) => {
          if (err) {
            console.error("❌ Error al actualizar la contraseña:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar la contraseña" });
          }
  
          if (result.affectedRows === 0) {
            console.error(
              "❌ No se actualizó ninguna contraseña, verifique el ID del usuario"
            );
            return res
              .status(400)
              .json({ error: "No se pudo actualizar la contraseña" });
          }
  
          console.log("✅ Contraseña actualizada correctamente");
          res.json({ message: "Contraseña actualizada correctamente" });
        }
      );
    } catch (err) {
      console.error("❌ Error al encriptar la nueva contraseña:", err);
      res.status(500).json({ error: "Error al encriptar la nueva contraseña" });
    }
  };

// **Recuperación de contraseña**
exports.forgotPassword = async (req, res) => {
  const { correo } = req.body;
  console.log("🔄 Solicitud de recuperación de contraseña para:", correo);

  db.query(
    "SELECT * FROM usuarios_admin WHERE correo = ?",
    [correo],
    async (err, results) => {
      if (err || results.length === 0) {
        console.error("❌ Usuario no encontrado o error en la consulta:", err);
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      try {
        const nuevaContrasena = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        db.query(
          "UPDATE usuarios_admin SET contrasena = ?, temporal = 1 WHERE correo = ?",
          [hashedPassword, correo],
          async (updateErr) => {
            if (updateErr) {
              console.error(
                "❌ Error al guardar la contraseña temporal:",
                updateErr
              );
              return res
                .status(500)
                .json({
                  success: false,
                  message: "Error al guardar la contraseña temporal",
                });
            }

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "carlos.andres.loaiza52@gmail.com",
                pass: "yieh yccp ygwq kpvc", // ✅ Usa token seguro
              },
            });

            const mailOptions = {
              from: "carlos.andres.loaiza52@gmail.com",
              to: correo,
              subject: "Contraseña temporal",
              text: `Tu nueva contraseña temporal es: ${nuevaContrasena}\nPor seguridad, cámbiala al iniciar sesión.`,
            };

            try {
              await transporter.sendMail(mailOptions);
              res.json({
                success: true,
                message: "Contraseña enviada por correo",
              });
            } catch (mailError) {
              console.error("❌ Error al enviar el correo:", mailError);
              res
                .status(500)
                .json({
                  success: false,
                  message: "No se pudo enviar el correo",
                });
            }
          }
        );
      } catch (err) {
        console.error("❌ Error al generar la nueva contraseña:", err);
        res
          .status(500)
          .json({
            success: false,
            message: "Error al generar la nueva contraseña",
          });
      }
    }
  );
};
