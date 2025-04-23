// Función para generar una contraseña temporal
const generarContrasenaTemporal = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let contrasena = "";
  for (let i = 0; i < 8; i++) {
    contrasena += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return contrasena;
};

module.exports = { generarContrasenaTemporal };
