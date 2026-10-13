const express = require('express');
const router = express.Router();
const conn = require('../db');   // importar conn
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { nombre_usuario, password } = req.body;
    const usuario = nombre_usuario.trim().toLowerCase();

    // Consulta con conn usando promesas
    const [rows] = await conn.promise().query(
      "SELECT id_usuario, nombre_personal, password, id_rol FROM usuario WHERE nombre_usuario = ?",
      [usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ type: 'danger', msg: 'Usuario y/o contraseña incorrectos.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password.trim(), user.password);

    if (!match) {
      return res.status(401).json({ type: 'danger', msg: 'Usuario y/o contraseña incorrectos.' });
    }

    // Procesar nombre_personal
    const partes = user.nombre_personal.trim().split(" ");
    let nombre_final = partes[0];
    if (partes.length >= 4) nombre_final = partes[0] + " " + partes[2];
    else if (partes.length === 3) nombre_final = partes[0] + " " + partes[1];
    else if (partes.length === 2) nombre_final = partes[0] + " " + partes[1];

    // Guardar datos en sesión
    req.session.user = {
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
      nombre_personal: nombre_final
    };

    // Respuesta JSON para el fetch
    res.json({ type: 'success', msg: 'Login exitoso' });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ type: 'danger', msg: 'Error en login' });
  }
});

module.exports = router;
