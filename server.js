const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // si guardas imágenes en uploads/

// ruta principal (home.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/form.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

  //  RUTA PARA VER LA PÁGINA DE DETALLE (SIRVE detail.html)
app.get('/detail', (req, res) => {
  // detail.html será servido desde /public/detail.html
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.use("/api/ventas", require("./routes/ventas.routes"));
app.use("/api/suscripciones", require("./routes/suscripciones.routes"));
// una ruta mas para los correo solamente
app.use("/api/correo", require("./routes/correo.routes"))

// Iniciar el servidor
// Escuchar en el puerto 3000

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

