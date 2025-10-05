require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Importar todas las rutas
const userRoutes = require("./routes/userRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const badgesRoutes = require("./routes/badgesRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Usar rutas
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/badges", badgesRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡API de Retos de Hábitos funcionando!");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});