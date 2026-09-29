// src/config/db.js
import mysql from 'mysql2/promise';
import { env } from './env.js'; // import env object

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port || 3306,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; // ✅ default export
