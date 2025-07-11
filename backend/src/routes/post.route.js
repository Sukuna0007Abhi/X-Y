import express from 'express';
import { getPosts, getUserPosts, getPost } from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// public routes
router.get('/', getPosts);
router.get('/:postId', getPost);
router.get('/user/:username', getUserPosts);

//Protected Routes
router.post('/',protectRoute,upload.single('image'),createPost);

export default router;