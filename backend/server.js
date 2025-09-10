require("dotenv").config();

const express = require("express");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos PostgreSQL"))
  .catch((err) => console.error("Error de conexión a la base de datos", err));

// Ruta de registro de usuarios
app.post("/api/users/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 2. Insertar el nuevo usuario en la base de datos
    const result = await client.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, password_hash]
    );

    // 3. Enviar una respuesta de éxito
    const newUser = result.rows[0];
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      // Código de error para violaciones de unicidad (email/username ya existen)
      return res.status(409).json({ message: "El usuario o email ya existe." });
    }
    res.status(500).json({ message: "Error en el servidor." });
  }
});

app.get("/", (req, res) => {
  res.send("¡API de Retos de Hábitos funcionando!");
});


// Ruta de login de usuarios
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    // Si el usuario no existe, devuelve un error 401
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 2. Comparar la contraseña ingresada con la encriptada
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // Si las contraseñas no coinciden, devuelve un error 401
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 3. Generar el token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // El token expira en 1 hora
      (err, token) => {
        if (err) throw err;
        // 4. Enviar el token y la información del usuario
        res.status(200).json({
          message: "Inicio de sesión exitoso",
          token,
          user: {
            id: user.id,
            username: user.username,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡API de Retos de Hábitos funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
