import express from 'express';
import { getComments, createComment, deleteComment } from '../controllers/comment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//public routes
router.get('/post/:postId', getComments);

//Protected Routes
router.post('/post/:postId', protectRoute, createComment);
router.delete('/:commentId', protectRoute, deleteComment);

export default router;