// src/modules/auth/auth.routes.js
import express from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
