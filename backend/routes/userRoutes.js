// backend/routes/usersRoutes.js
const express = require("express");
const client = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

// 1. Registro de usuario (Ruta estática)
// POST /api/users/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await client.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: "Registro exitoso." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// 2. Inicio de sesión (Ruta estática)
// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }
    const payload = {
      user: {
        id: user.rows[0].id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// 3. Obtener los datos del perfil del usuario autenticado (Ruta estática) 🔒
// GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await client.query(
      "SELECT id, username, email, points, created_at FROM users WHERE id = $1", // ⬅️ Asegurado que 'points' está en el SELECT
      [user_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// 4. Cambiar información del Usuario (Ruta estática) 🔒
// PUT /api/users/me
router.put("/me", auth, async (req, res) => {
  const { username } = req.body;
  const user_id = req.user.id;
  try {
    if (!username) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario no puede estar vacío." });
    }
    const result = await client.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username",
      [username, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al actualizar el usuario." });
  }
});

// 5. Eliminar la Cuenta (Ruta estática) 🔒
// DELETE /api/users/me
router.delete("/me", auth, async (req, res) => {
  const user_id = req.user.id;
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM challenges WHERE creator_id = $1", [
      user_id,
    ]);
    await client.query("DELETE FROM user_challenges WHERE user_id = $1", [
      user_id,
    ]);
    await client.query("DELETE FROM users WHERE id = $1", [user_id]);
    await client.query("COMMIT");
    res.status(200).json({ message: "Cuenta eliminada exitosamente." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ message: "Error al eliminar la cuenta." });
  }
});

// 6. Obtener el ranking de usuarios (Ruta estática)
// GET /api/users/ranking
router.get("/ranking", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, username, points FROM users ORDER BY points DESC, created_at ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener el ranking." });
  }
});

// 7. Obtener el perfil de cualquier usuario y sus retos creados (Ruta dinámica)
// GET /api/users/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Obtener la información pública del usuario
    const userResult = await client.query(
      "SELECT id, username, created_at FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length === 0) {
      // Devuelve 404 si el ID no existe en la tabla 'users'
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const publicUser = userResult.rows[0]; // 2. Obtener los retos creados por ese usuario

    const challengesResult = await client.query(
      "SELECT id, title, description, duration_days FROM challenges WHERE creator_id = $1 AND is_active = TRUE ORDER BY created_at DESC",
      [id]
    ); // 3. Obtener el conteo de retos que ha completado

    const completedCountResult = await client.query(
      "SELECT COUNT(*) FROM user_challenges WHERE user_id = $1 AND status = 'completed'",
      [id]
    );
    const completedChallengesCount = parseInt(
      completedCountResult.rows[0].count,
      10
    ); // 4. Devolver la información consolidada en el formato que el frontend espera

    res.status(200).json({
      user: publicUser,
      createdChallenges: challengesResult.rows,
      completedChallengesCount: completedChallengesCount,
    });
  } catch (err) {
    console.error(
      "Error al obtener el perfil de usuario público:",
      err.message
    );
    res.status(500).json({ message: "Error en el servidor." });
  }
});
module.exports = router;
