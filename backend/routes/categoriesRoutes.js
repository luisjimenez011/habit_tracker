const express = require('express');
const client = require('../database');

const router = express.Router();

// Obtener todas las categorías
// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor al obtener las categorías.' });
    }
});

module.exports = router;