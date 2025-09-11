const express = require('express');
const client = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// 1. Obtener los datos del perfil del usuario autenticado (Ruta protegida) 🔒
// GET /api/users/me
router.get('/me', auth, async (req, res) => {
    try {
        // El middleware 'auth' ya ha adjuntado el ID del usuario a la petición
        const user_id = req.user.id;
        const result = await client.query(
            "SELECT id, username, email, points, created_at FROM users WHERE id = $1",
            [user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// 2. Obtener el ranking de usuarios (no protegida)
// GET /api/users/ranking
router.get('/ranking', async (req, res) => {
    try {
        const result = await client.query(
            "SELECT username, points FROM users ORDER BY points DESC, created_at ASC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error en el servidor al obtener el ranking." });
    }
});

module.exports = router;