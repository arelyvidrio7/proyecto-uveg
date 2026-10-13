const express = require('express');
const router = express.Router();
const conn = require('../db');   // importar conn
const bcrypt = require('bcryptjs');

function quitarAcentos(cadena) {
  const acentos = { Á:"A",É:"E",Í:"I",Ó:"O",Ú:"U",á:"a",é:"e",í:"i",ó:"o",ú:"u",Ñ:"N",ñ:"n" };
  return cadena.replace(/[ÁÉÍÓÚáéíóúÑñ]/g, m => acentos[m] || m);
}

router.post('/signup', async (req, res) => {
  try {
    const { nombre_usuario, password, nombre_personal, genero, fecha_nacimiento, correo_electronico } = req.body;
    const usuario = nombre_usuario.trim().toLowerCase();
    const correo = correo_electronico.trim();

    // Verificar si ya existe usuario o correo
    const [rows] = await conn.promise().query(
      "SELECT * FROM usuario WHERE nombre_usuario = ? OR correo_electronico = ?",
      [usuario, correo]
    );
    if (rows.length > 0) {
      return res.status(400).json({ type: 'danger', msg: 'El usuario o correo ya existe. Elija otro.' });
    }

    // Encriptar contraseña y limpiar acentos
    const hash = await bcrypt.hash(password.trim(), 10);
    const nombreSinAcentos = quitarAcentos(nombre_personal.trim());

    // Insertar nuevo usuario con rol estudiante (2)
    await conn.promise().query(
      "INSERT INTO usuario (nombre_usuario, password, nombre_personal, genero, fecha_nacimiento, correo_electronico, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [usuario, hash, nombreSinAcentos, genero, fecha_nacimiento, correo, 2]
    );

    // Respuesta JSON
    res.json({ type: 'success', msg: 'Usuario registrado correctamente. Se encuentra en espera de validación.' });
  } catch (err) {
    console.error('Error en signup:', err);
    res.status(500).json({ type: 'danger', msg: 'Error al registrar usuario' });
  }
});

module.exports = router;
