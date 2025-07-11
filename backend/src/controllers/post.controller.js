import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName profilePicture')
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'User',
            select: 'username firstName lastName profilePicture'
        }
    });
    res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId)
        .populate('user', 'username firstName lastName profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username firstName lastName profilePicture'
            }
        });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
            };
        res.status(200).json({ post });
});

export const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    
    const posts = await Post.find({ user: { $in: [username] } })
        .sort({ createdAt: -1 })
        .populate('user', 'username firstName lastName profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username firstName lastName profilePicture'
            },
        });
    if (!posts || posts.length === 0) {
        res.status(404).json({ message: 'No posts found for this user' });
        return;
    }
    res.status(200).json({ posts });
});