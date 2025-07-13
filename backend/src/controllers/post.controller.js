import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { getAuth } from '../middleware/auth.middleware.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/notification.model.js';
import Comment from '../models/comment.model.js';

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

export const createPost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file ? req.file.path : null; // Assuming the image is uploaded and stored in req.file

    if (!content || !imageFile) {
        res.status(400).json({ message: 'Post must contain content / image' });
        return;
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    let imageUrl = "";
    if (imageFile) {
        try {
            //convert buffer to base64 for cloudinary upload
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'posts',
                resource_type: 'image',
                public_id: `${userId}-${Date.now()}`,
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            });
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError);
            res.status(400).json({ message: 'Error uploading image' });
            return;
        }
    }
    const post = await Post.create({
        user: user._id,
        content: content || '',
        image: imageUrl || '',
    });

    res.status(201).json({ post: {
            _id: post._id,
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
            },
            content: post.content,
            image: post.image,
            createdAt: post.createdAt,
        },
        message: 'Post created successfully'
    });
});

export const likepost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;
    
    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if(!user || !post) {
        res.status(404).json({ message: 'User or Post not found' });
        return;
    }

    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
        //unlike
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: user._id }
        });
    } else {
        //like
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id }
        });

        //create notfication for not liking own post
        if (user._id.toString() !== post.user.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                type: 'like',
                postId: post._id,
            });
        }
    }

    res.status(200).json({
        message: isLiked ? 'Post unliked successfully' : 'Post liked successfully',
        postId: post._id,
        likesCount: post.likes.length + (isLiked ? -1 : 1), // Adjust count based on like/unlike action
    });
});

export const deletePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
        res.status(404).json({ message: 'User or Post not found' });
        return;
    }

    if (post.user.toString() !== user._id.toString()) {
        res.status(403).json({ message: 'You are not allowed to delete this post, look at your own in the mirror, loser' });
        return;
    }

    // delete all the comments associated with the post
    await Comment.deleteMany({ post: postId });

    // delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
});

