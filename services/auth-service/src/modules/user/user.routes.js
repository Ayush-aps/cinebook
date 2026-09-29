import express from 'express';
import { userController } from './user.controller.js';
import { authMiddleware, roleMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.put('/profile', userController.updateProfile);

// Admin only routes
router.get('/admin/users', roleMiddleware(['ADMIN']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;