 import asyncHandler from 'express-async-handler';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { getAuth } from '@clerk/express';
import Notification from '../models/notification.model.js';

export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
        .populate('user', 'username firstName lastName profilePicture')
        .sort({ createdAt: -1 });
    res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    if (!content || content.trim() === '') {
        res.status(400).json({ message: 'Content is required' });
        return;
    }

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
        res.status(404).json({ message: 'User or Post not found' });
        return;
    }

    const comment = await Comment.create({
        user: user._id,
        post: post._id,
        content,
    });

    //link comment to post
    await Post.findByIdAndUpdate(post._id, {
        $push: { comments: comment._id }
    });

    // Create a notification for the post author
    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: 'comment',
            post: post._id,
            comment: comment._id,
        });
    }

    res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId);

    if (!user || !comment) {
        res.status(404).json({ message: 'User or Comment not found' });
        return;
    }

    if (comment.user.toString() !== user._id.toString()) {
        res.status(403).json({ message: 'You can only delete your own comments, look at you, just a goober' });
        return;
    }

    //remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id }
    });
    //delete comment
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
});