const express = require('express');
const client = require('../database');
const auth = require('../middleware/auth'); 

const router = express.Router();

// 1. Crear un nuevo reto (Ruta protegida) 🔒
// POST /api/challenges
router.post('/', auth, async (req, res) => {
    const { title, description, duration_days, category_id } = req.body;
    const creator_id = req.user.id;
    try {
        const newChallenge = await client.query(
            "INSERT INTO challenges (title, description, duration_days, creator_id, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, description, duration_days, creator_id, category_id]
        );
        res.status(201).json({
            message: "Reto creado exitosamente",
            challenge: newChallenge.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error en el servidor al crear el reto." });
    }
});

// 2. Obtener todos los retos
// GET /api/challenges
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM challenges');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al obtener los retos.' });
    }
});

// 3. Obtener los detalles de un solo reto
// GET /api/challenges/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM challenges WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reto no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// 4. Unirse a un reto (Ruta protegida) 🔒
// POST /api/challenges/:id/join
router.post('/:id/join', auth, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        await client.query(
            "INSERT INTO user_challenges (user_id, challenge_id, start_date) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, challenge_id) DO NOTHING",
            [user_id, id]
        );
        res.status(201).json({ message: 'Te has unido al reto exitosamente.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al unirse al reto.' });
    }
});

// 5. Marcar el progreso de un reto (Ruta protegida) 🔒
// PUT /api/challenges/:id/progress
router.put('/:id/progress', auth, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await client.query(
            "UPDATE user_challenges SET progress_count = progress_count + 1, last_progress_date = NOW() WHERE user_id = $1 AND challenge_id = $2 RETURNING *",
            [user_id, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al marcar el progreso.' });
    }
});

module.exports = router;