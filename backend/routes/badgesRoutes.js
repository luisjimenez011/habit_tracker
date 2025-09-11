const express = require('express');
const client = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// 1. Obtener una lista de todas las insignias disponibles
// GET /api/badges
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM badges ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al obtener las insignias.' });
    }
});

// 2. Obtener las insignias de un usuario autenticado (Ruta protegida) 🔒
// GET /api/users/me/badges
router.get('/me/badges', auth, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await client.query(
            "SELECT b.* FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = $1",
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al obtener las insignias del usuario.' });
    }
});

module.exports = router;