// database.js
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch((err) => console.error('Error de conexión a la base de datos', err));

module.exports = client;