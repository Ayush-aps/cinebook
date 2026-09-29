import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct path to .env (auth-service/.env)
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('ENV LOADED:', {
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST
});

export const env = {
  port: process.env.AUTH_SERVICE_PORT || 3001,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};
