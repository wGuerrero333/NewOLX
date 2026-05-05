// db.js
const mysql = require('mysql2/promise');
// esto lo copie del npm oficial para que funcione este dotenv
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'administradorNuevo',
  password: process.env.DB_PASS || '#Delcamino333',
  database: process.env.DB_NAME || 'grupo_ps',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports = pool;

// SQL to create the database and tables:

// CREATE DATABASE grupo_ps CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
// USE grupo_ps;

// -- tabla para suscripciones / contacto (form.html)
// CREATE TABLE suscripciones (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   nombre VARCHAR(200) NOT NULL,
//   email VARCHAR(200) NOT NULL,
//   mensaje TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// añadir columna role a la tabla suscripciones
// ALTER TABLE suscripciones
// ADD COLUMN role ENUM('administrador', 'miembro', 'usuario') NOT NULL 
// AFTER mensaje;


// -- tabla para publicaciones de venta (formVenta.html)
// CREATE TABLE ventas (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   titulo VARCHAR(255) NOT NULL,
//   descripcion TEXT,
//   precio DECIMAL(12,2),
//   categoria VARCHAR(100),
//   ubicacion VARCHAR(255),  
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// se crea la table email solo para la casilla email;
// CREATE TABLE correo (
//   id INT AUTO_INCREMENT PRIMARY KEY,

//   correo VARCHAR(200) NOT NULL);

// insert INTO correo (correo) VALUES ('prueba');

