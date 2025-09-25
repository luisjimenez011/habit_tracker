// backend/routes/commentsRoutes.js (VERSIÓN FINAL Y CORRECTA)

const express = require("express");
const client = require("../database");
const auth = require("../middleware/auth"); // Para la ruta POST

const router = express.Router();

// 1. Obtener todos los comentarios de un reto específico
// URL completa: GET /api/comments/:challengeId
router.get("/:challengeId", async (req, res) => {
  // 👈 Usamos 'challengeId' para mayor claridad y consistencia
  const { challengeId } = req.params;
  try {
    const result = await client.query(
      // Asumo que tu columna de ID de reto se llama 'challenge_id' en la tabla comments
      "SELECT c.comment_text, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.challenge_id = $1 ORDER BY c.created_at DESC",
      [challengeId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener comentarios:", err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener los comentarios." });
  }
});

// 2. Publicar un nuevo comentario en un reto (Ruta protegida) 🔒
// URL completa: POST /api/comments/:challengeId
router.post("/:challengeId", auth, async (req, res) => {
  const { challengeId } = req.params;
  const { content } = req.body; // El frontend envía la clave 'content'
  const user_id = req.user.id;

  if (!content) {
    return res
      .status(400)
      .json({ message: "El contenido del comentario es obligatorio." });
  }

  try {
    const result = await client.query(
      "INSERT INTO comments (comment_text, user_id, challenge_id) VALUES ($1, $2, $3) RETURNING *",
      [content, user_id, challengeId]
    );
    res.status(201).json({
      message: "Comentario publicado exitosamente.",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error("Error al publicar comentario:", err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al publicar el comentario." });
  }
});

module.exports = router;
