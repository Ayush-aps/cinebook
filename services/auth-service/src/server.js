import app from './app.js';
import { env } from './config/env.js';
import pool from './config/db.js';

// Test database connection
try {
  const connection = await pool.getConnection();
  console.log('✅ Database connected successfully');
  connection.release();
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

const server = app.listen(env.port, () => {
  console.log(`✅ Auth Service running on port ${env.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});