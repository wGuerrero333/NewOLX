// esto lo copie del npm oficial para que funcione este dotenv
require('dotenv').config()

// Se importan las variables de entorno de el archivo .env donde las excribimos como si fueramos el entorno de la nube

 const PORT = process.env.PORT || 5500;
 const DB_HOST = process.env.HOST || "localhost"
 const DB_USER = process.env.DB_USER || "administradorNuevo"
 const DB_DATABASE = process.env.DB_DATABASE || "grupoPS"
 const DB_PASSWORD = process.env.DB_PASSWORD || "#Delcamino333"
 const DB_PORT = process.env.DB_PORT || 3306
 
 module.exports = {PORT, DB_HOST, DB_USER, DB_DATABASE, DB_PASSWORD, DB_PORT}



