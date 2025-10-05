const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../database'); 

// Inicializamos el enrutador de Express
const router = express.Router();

// Ruta de registro de usuarios
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const result = await client.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, password_hash]
    );
    const newUser = result.rows[0];
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      return res.status(409).json({ message: "El usuario o email ya existe." });
    }
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// Ruta de inicio de sesión de usuarios
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Inicio de sesión exitoso",
          token,
          user: {
            id: user.id,
            username: user.username,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

module.exports = router;