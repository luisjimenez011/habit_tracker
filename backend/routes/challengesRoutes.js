const { checkAndAwardBadges } = require("../utils/badgeChecker");
const express = require("express");
const client = require("../database");
const auth = require("../middleware/auth");

const router = express.Router();

// 1. Crear un nuevo reto (Ruta protegida) 🔒
// POST /api/challenges
router.post("/", auth, async (req, res) => {
  const { title, description, duration_days, category_id } = req.body;
  const creator_id = req.user.id;
  try {
    const newChallenge = await client.query(
      "INSERT INTO challenges (title, description, duration_days, creator_id, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, duration_days, creator_id, category_id]
    );

    // INICIO LÓGICA DE INSIGNIAS POR CREACIÓN
    // 1. Obtener contadores actualizados
    const userStatsResult = await client.query(
      "SELECT points, created_at, (SELECT COUNT(*) FROM user_challenges WHERE user_id = $1 AND status = 'completed') AS completed_count FROM users WHERE id = $1",
      [creator_id]
    );
    const { created_at, points, completed_count } = userStatsResult.rows[0];

    // Obtener los retos creados (el conteo debe ser +1 después de la inserción)
    const createdCountResult = await client.query(
      "SELECT COUNT(*) FROM challenges WHERE creator_id = $1",
      [creator_id]
    );
    const created_count = parseInt(createdCountResult.rows[0].count);

    // Calcular días de antigüedad
    const timeDiff = new Date().getTime() - new Date(created_at).getTime();
    const daysSinceSignup = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // 2. Llamar al verificador de insignias
    const newBadges = await checkAndAwardBadges(creator_id, {
      points: parseInt(points),
      completed_count: parseInt(completed_count),
      created_count: created_count,
      days_since_signup: daysSinceSignup,
    });
    // FIN LÓGICA DE INSIGNIAS POR CREACIÓN

    res.status(201).json({
      message: "Reto creado exitosamente",
      challenge: newChallenge.rows[0],
      new_badges_awarded: newBadges, // Nuevo: Devolver insignias ganadas
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor al crear el reto." });
  }
});

// 2. RUTA UNIFICADA (Para obtener retos, buscar y filtrar por categoría)
// GET /api/challenges?search=termino&category_id=X
router.get("/", async (req, res) => {
  // Extraemos los parámetros de la URL. Si no existen, son undefined.
  const { search, category_id } = req.query;

  let query =
    "SELECT c.*, cat.name as category_name, u.username as creator_username FROM challenges c LEFT JOIN categories cat ON c.category_id = cat.id LEFT JOIN users u ON c.creator_id = u.id WHERE c.is_active = TRUE";
  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND c.title ILIKE $${paramIndex}`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (category_id && category_id !== "") {
    query += ` AND c.category_id = $${paramIndex}`;
    values.push(category_id);
    paramIndex++;
  }

  query += " ORDER BY c.created_at DESC";

  try {
    const result = await client.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener los retos filtrados:", err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener los retos." });
  }
});

// 3. Obtener los retos del usuario (Ruta protegida y estática) 🔒
// GET /api/challenges/me
router.get("/me", auth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await client.query(
      "SELECT c.*, uc.start_date, uc.progress_count, uc.status, uc.last_progress_date FROM user_challenges uc JOIN challenges c ON uc.challenge_id = c.id WHERE uc.user_id = $1 ORDER BY uc.start_date DESC",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Error en el servidor al obtener los retos del usuario.",
    });
  }
});

// 4. Ruta para la lista de categorías de retos (Ruta estática)
// GET /api/challenges/categories
router.get("/categories", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM categories");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener las categorías." });
  }
});

// 5. Unirse a un reto (Ruta protegida) 🔒
// POST /api/challenges/:id/join
router.post("/:id/join", auth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await client.query(
      "INSERT INTO user_challenges (user_id, challenge_id, start_date) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, challenge_id) DO NOTHING",
      [user_id, id]
    );
    res.status(201).json({ message: "Te has unido al reto exitosamente." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error al unirse al reto." });
  }
});

// 6. Marcar el progreso de un reto (Ruta protegida) 🔒
// PUT /api/challenges/:id/progress
router.put("/:id/progress", auth, async (req, res) => {
  const { id: challengeId } = req.params;
  const user_id = req.user.id;
  const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  try {
    // 1. Obtener datos del reto y verificar la última fecha de progreso
    const checkResult = await client.query(
      // Usa TO_CHAR para obtener la fecha de progreso como una cadena simple 'YYYY-MM-DD'
      "SELECT c.duration_days, uc.progress_count, TO_CHAR(uc.last_progress_date, 'YYYY-MM-DD') AS last_progress_date_str FROM user_challenges uc JOIN challenges c ON uc.challenge_id = c.id WHERE uc.user_id = $1 AND uc.challenge_id = $2",
      [user_id, challengeId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no unido a este reto." });
    } // CAMBIO CRUCIAL: Usamos la propiedad que devuelve la consulta: last_progress_date_str

    const { duration_days, progress_count, last_progress_date_str } =
      checkResult.rows[0]; // Compara la cadena simple 'YYYY-MM-DD' de la base de datos con la de hoy

    if (last_progress_date_str === today) {
      return res.status(400).json({
        message: "Ya marcaste tu progreso para este reto hoy. Vuelve mañana.",
      });
    }

    if (progress_count >= duration_days) {
      return res.status(400).json({
        message: "¡Reto completado! No puedes seguir registrando progreso.",
      });
    } // INICIO DE LA TRANSACCIÓN

    await client.query("BEGIN"); // 2. Actualizar el contador de progreso y la fecha (ahora es seguro)

    const updateResult = await client.query(
      `UPDATE user_challenges 
SET progress_count = progress_count + 1, last_progress_date = NOW()
WHERE user_id = $1 AND challenge_id = $2 RETURNING *`,
      [user_id, challengeId]
    );

    const updatedUserChallenge = updateResult.rows[0]; // 🔑 PUNTOS POR PROGRESO DIARIO: Otorga 10 puntos.

    await client.query("UPDATE users SET points = points + 10 WHERE id = $1", [
      user_id,
    ]);

    let pointsGained = 10; // 3. Verificar si se completó el reto y actualizar el estado

    if (
      updatedUserChallenge.progress_count >= duration_days &&
      updatedUserChallenge.status !== "completed"
    ) {
      await client.query(
        "UPDATE user_challenges SET status = 'completed' WHERE user_id = $1 AND challenge_id = $2",
        [user_id, challengeId]
      );
      updatedUserChallenge.status = "completed"; // 🔑 PUNTOS POR COMPLETAR EL RETO: Otorga 50 puntos extra.

      const completionPoints = 50;
      await client.query(
        "UPDATE users SET points = points + $1 WHERE id = $2",
        [completionPoints, user_id]
      );
      pointsGained += completionPoints;
    } // FINALIZA LA TRANSACCIÓN

    await client.query("COMMIT");

       // INICIO LÓGICA DE INSIGNIAS POR PROGRESO

    // 🔑 1. CÁLCULO DE RACHA (STREAK_DAYS)
    let currentStreak = 0;
    
    // Obtenemos todos los días con progreso único para calcular la racha
    const allProgressDatesResult = await client.query(
        "SELECT DISTINCT DATE(last_progress_date) AS progress_day FROM user_challenges WHERE user_id = $1 AND last_progress_date IS NOT NULL ORDER BY progress_day DESC",
        [user_id]
    );
    const progressDays = allProgressDatesResult.rows.map(row => new Date(row.progress_day));
    
    // --- CAMBIO AQUÍ: Usamos un nuevo nombre de variable ---
    const nowForStreak = new Date(); 
    nowForStreak.setHours(0, 0, 0, 0); // Limpiamos la hora para la comparación de días

    if (progressDays.length > 0) {
        // Verificamos si el progreso más reciente fue ayer o si es la primera vez
        
        // Si la fecha más reciente en la BD es hoy (lo cual ya está chequeado y validado en el primer bloque
        // por la variable 'today' en formato string), la racha comienza en 1.
        currentStreak = 1; 
        
        let expectedDate = nowForStreak; // Usamos el nuevo nombre aquí
        
        for (let i = 1; i < progressDays.length; i++) {
            const prevDate = progressDays[i];
            prevDate.setHours(0, 0, 0, 0);

            const dayBeforeExpected = new Date(expectedDate);
            dayBeforeExpected.setDate(expectedDate.getDate() - 1);
            dayBeforeExpected.setHours(0, 0, 0, 0);

            if (prevDate.getTime() === dayBeforeExpected.getTime()) {
                currentStreak++;
                expectedDate = prevDate;
            } else if (prevDate.getTime() < dayBeforeExpected.getTime()) {
                break;
            }
        }
    }


    // 🔑 2. LÓGICA DE TIEMPO ESPECIAL (SPECIAL_TIME)
    const now = new Date(); // Hora actual del servidor
    const hour = now.getHours();

    const isEarlyBird = (hour < 6); // Madrugador (antes de las 6 AM)
    // Noctámbulo (después de las 10 PM O entre 12 AM y 4 AM)
    const isNightOwl = (hour >= 22 || (hour >= 0 && hour < 4)); 


    // 🔑 3. OBTENER OTRAS ESTADÍSTICAS (Actualizada para incluir comentarios)
    const userStatsResult = await client.query(
        `SELECT 
            u.points, 
            u.created_at,
            (SELECT COUNT(*) FROM user_challenges WHERE user_id = $1 AND status = 'completed') AS completed_count,
            (SELECT COUNT(*) FROM challenges WHERE creator_id = $1) AS created_count,
            (SELECT COUNT(*) FROM comments WHERE user_id = $1) AS comments_written_count
         FROM users u 
         WHERE u.id = $1`,
        [user_id]
    );

    const { points, created_at, completed_count, created_count: created_c, comments_written_count } = userStatsResult.rows[0];
    
    // Días de antigüedad (DAYS_SINCE_SIGNUP)
    const creationDate = new Date(created_at);
    const timeDiff = new Date().getTime() - creationDate.getTime();
    const daysSinceSignup = Math.ceil(timeDiff / (1000 * 3600 * 24));


    // 🔑 4. LLAMAR AL VERIFICADOR DE INSIGNIAS CON TODAS LAS STATS
    const newBadges = await checkAndAwardBadges(
        user_id,
        { 
          points: parseInt(points), 
          completed_count: parseInt(completed_count),
          created_count: parseInt(created_c),
          days_since_signup: daysSinceSignup,
          comments_written: parseInt(comments_written_count),
          streak_days: currentStreak, 
          is_early_bird: isEarlyBird, 
          is_night_owl: isNightOwl,   
        }
    );
    // FIN LÓGICA DE INSIGNIAS POR PROGRESO

    // Devuelve los puntos ganados MÁS las insignias nuevas
    res.status(200).json({
      ...updatedUserChallenge,
      points_gained: pointsGained,
      new_badges_awarded: newBadges,
    });
  } catch (err) {
    // Si algo falla, deshace todas las operaciones SQL
    await client.query("ROLLBACK");
    console.error("Error al marcar el progreso:", err.message);
    res.status(500).json({ message: "Error al marcar el progreso." });
  }
});

// 7. Ruta para ver los participantes de un reto (Ruta protegida) 🔒
// GET /api/challenges/:id/participants
router.get("/:id/participants", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "SELECT u.id, u.username, uc.start_date, uc.progress_count, uc.status FROM user_challenges uc JOIN users u ON uc.user_id = u.id WHERE uc.challenge_id = $1",
      [id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener los participantes." });
  }
});

// 8. Obtener los retos creados por el usuario autenticado (Ruta protegida) 🔒
// GET /api/challenges/created
router.get("/created", auth, async (req, res) => {
  const creator_id = req.user.id;
  try {
    const result = await client.query(
      // 🔑 IMPORTANTE: Añadida 'duration_days' al SELECT
      "SELECT id, title, description, created_at, is_active, duration_days FROM challenges WHERE creator_id = $1 ORDER BY created_at DESC",
      [creator_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener los retos creados:", err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// 9. Obtener los detalles de un solo reto (Ruta dinámica)
// GET /api/challenges/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "SELECT * FROM challenges WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reto no encontrado." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

module.exports = router;
