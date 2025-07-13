import express from 'express';
import { getPosts, getUserPosts, getPost, createPost, likepost, deletePost } from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// public routes
router.get('/', getPosts);
router.get('/:postId', getPost);
router.get('/user/:username', getUserPosts);

//Protected Routes
router.post('/',protectRoute,upload.single('image'),createPost);
router.post('/:postId/like', protectRoute, likepost);
router.delete('/:postId', protectRoute, deletePost);

export default router;