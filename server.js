const https = require('https');
const express = require('express');
const session = require('express-session');
const path = require('path');
const conn = require('./db');
require('dotenv').config();
const fs = require('fs');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'clave', resave: false, saveUninitialized: true }));

app.use('/auth', signupRoutes);
app.use('/auth', loginRoutes);

const options = {
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem')
};

https.createServer(options, app).listen(3000, () => {
  console.log('Servidor HTTPS corriendo en https://www.proyectoweb.com:3000');
});


// Ruta para traer los usuarios con rol 2 (estudiantes)
app.get('/usuarios', (req, res) => {
  const sql = `
    SELECT id_usuario, nombre_usuario, nombre_personal, genero, correo_electronico
    FROM usuario WHERE id_rol = 2
  `;
  
  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar usuarios:', err);
      res.status(500).json({ error: 'Error al consultar usuarios' });
      return;
    }
    res.json(results); // devuelve lista en JSON
  });
});

// Ruta de logout
app.get('/logout', (req, res) => {
  // Redirigimos a login
  res.redirect('/iniciarsesion.html');
});

// Ruta de registro
app.get('/registrarse', (req, res) => {
  // Servimos el archivo de registro
  res.sendFile(__dirname + '/public/registrarse.html');
});

// Ruta de login
app.get('/login', (req, res) => {
  // Servimos el archivo de login
  res.sendFile(__dirname + '/public/iniciarsesion.html');
});

// Ruta de administrar_estudiantes
app.get('/administrar_estudiantes', (req, res) => {
  // Servimos el archivo administrar_estudiantes.html desde la carpeta public
  res.sendFile(__dirname + '/public/administrar_estudiantes.html');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ruta de saludo
app.get('/saludo', (req, res) => {
  res.json({ mensaje: 'Hola, Express.js está funcionando.' });
});