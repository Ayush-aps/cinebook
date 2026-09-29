// src/config/db.js
import mysql from 'mysql2/promise';
import { env } from './env.js'; // import env object

// Write Pool (Primary)
const writePool = mysql.createPool({
  host: env.db.host,
  port: env.db.port || 3306,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Read Pool (Replica)
const readPool = mysql.createPool({
  host: env.db.readHost,
  port: env.db.readPort,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const executeRead = (sql, params) => readPool.execute(sql, params);
export const executeWrite = (sql, params) => writePool.execute(sql, params);
export const getReadConnection = () => readPool.getConnection();

export default writePool; // Default to write pool for backward compatibility
