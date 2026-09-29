// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
}));
app.use(express.json()); // important to parse JSON body

// Routes
app.use('/auth', authRoutes); // <-- Mount auth routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

export default app;
