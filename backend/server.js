// server.js
require("dotenv").config();
const express = require("express");
const client = require("./database");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const badgesRoutes = require("./routes/badgesRoutes"); // Importa las rutas de insignias

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Agrupamos las rutas por su prefijo
app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", badgesRoutes); // Usa las rutas de insignias de usuario
app.use("/api/challenges", challengesRoutes);
app.use("/api/challenges", commentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/badges", badgesRoutes); // Usa las rutas de insignias

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡API de Retos de Hábitos funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});