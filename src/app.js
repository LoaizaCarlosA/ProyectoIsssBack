const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');  // Si usas XLSX para procesar el archivo Excel

const app = express();
const port = 5000;

// Usar CORS para permitir solicitudes solo desde el origen http://localhost:8083
app.use(cors({
  origin: 'http://localhost:8083',  // Permitir solo solicitudes desde este origen
}));

// Ruta para obtener los datos del archivo Excel
app.get('/api/excel-data', (req, res) => {
  const workbook = XLSX.readFile('C:\Users\Usuario\Desktop\Backend\Padron_Unificado.xlsx');  // Asegúrate de que esta ruta sea correcta
  const sheet_name_list = workbook.SheetNames;
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  res.json(jsonData);  // Enviar los datos al frontend
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
