require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  try {
    await client.connect();
    console.log('Conectado a la base de datos para crear tablas...');

    const queries = `
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabla de categorías
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );

      -- Tabla de retos
      CREATE TABLE IF NOT EXISTS challenges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        duration_days INTEGER NOT NULL,
        creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabla intermedia para usuarios y retos (participación)
      CREATE TABLE IF NOT EXISTS user_challenges (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        last_progress_date DATE,
        progress_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        PRIMARY KEY (user_id, challenge_id)
      );

      -- Tabla de comentarios
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        comment_text TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabla de badges
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      );

      -- Tabla intermedia para usuarios y badges
      CREATE TABLE IF NOT EXISTS user_badges (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
        awarded_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, badge_id)
      );
    `;

    await client.query(queries);
    console.log('¡Todas las tablas han sido creadas exitosamente!');

  } catch (err) {
    console.error('Error al crear las tablas:', err);
  } finally {
    await client.end();
  }
};

createTables();