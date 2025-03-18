const XLSX = require("xlsx");

app.get("/api/excel-data", (req, res) => {
  const workbook = XLSX.readFile(
    "C:/Users/Usuario/Desktop/ETL_Padron_Back/Padron_Unificado.xlsx"
  );
  const sheet_name_list = workbook.SheetNames;
  const jsonData = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]]
  );
  res.json(jsonData);
});
