import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/me', protect, getUserProfile);

// Update user profile
router.put('/me', protect, updateUserProfile);

export default router;