const express = require('express');
const suscripcionesRoutes = require('./routes/suscripciones.routes');

const app = express();
app.use(express.json());

app.use('/api/suscripciones', suscripcionesRoutes);

module.exports = app;