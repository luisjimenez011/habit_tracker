// server.js
require("dotenv").config();
const express = require("express");
const client = require("./database"); // Importamos la conexión
const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Usamos el enrutador de autenticación para las rutas de /api/users
app.use("/api/users", authRoutes);

// Ruta protegida para crear un nuevo reto
app.post("/api/challenges", auth, async (req, res) => {
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

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡API de Retos de Hábitos funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});