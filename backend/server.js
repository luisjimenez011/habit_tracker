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
const badgesRoutes = require("./routes/badgesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Agrupamos las rutas por su prefijo
app.use("/api/users", authRoutes); // /api/users/register, /api/users/login
app.use("/api/users", userRoutes); // /api/users/me, /api/users/ranking
app.use("/api/users", badgesRoutes); // /api/users/me/badges
app.use("/api/challenges", challengesRoutes); // /api/challenges, /api/challenges/:id, /api/challenges/:id/join
app.use("/api/challenges", commentsRoutes); // /api/challenges/:id/comments
app.use("/api/categories", categoriesRoutes); // /api/categories
app.use("/api/badges", badgesRoutes); // /api/badges

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡API de Retos de Hábitos funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});