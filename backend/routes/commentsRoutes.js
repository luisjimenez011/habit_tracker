const express = require('express');
const client = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// 1. Obtener todos los comentarios de un reto específico
// GET /api/challenges/:id/comments
router.get('/:challenge_id/comments', async (req, res) => {
    const { challenge_id } = req.params;
    try {
        const result = await client.query(
            "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.challenge_id = $1 ORDER BY c.created_at DESC",
            [challenge_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al obtener los comentarios.' });
    }
});

// 2. Publicar un nuevo comentario en un reto (Ruta protegida) 🔒
// POST /api/challenges/:id/comments
router.post('/:challenge_id/comments', auth, async (req, res) => {
    const { challenge_id } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.id;

    try {
        const result = await client.query(
            "INSERT INTO comments (comment_text, user_id, challenge_id) VALUES ($1, $2, $3) RETURNING *",
            [comment_text, user_id, challenge_id]
        );
        res.status(201).json({
            message: "Comentario publicado exitosamente.",
            comment: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al publicar el comentario.' });
    }
});

module.exports = router;