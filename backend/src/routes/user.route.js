import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);

router.post('/sync', protectRoute, syncUser);
router.put('/profile', protectRoute, updateProfile);
// update profile => auth

export default router;