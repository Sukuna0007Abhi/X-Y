import express from 'express';
import { getUserProfile, syncUser, updateProfile, getCurrentUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);

router.post('/sync', protectRoute, syncUser);
router.post('/me', protectRoute, getCurrentUser);
router.put('/profile', protectRoute, updateProfile);
// update profile => auth

export default router;