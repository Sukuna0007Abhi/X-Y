import asyncHandler from 'express-async-handler';
import Notification from '../models/notification.model.js';
import { getAuth } from '@clerk/express';
import User from '../models/user.model.js';

// Get all notifications for the authenticated user
export const getNotifications = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const notifications = await Notification.find({ to: user._id })
        .sort({ createdAt: -1 })
        .populate('from', 'username firstName lastName profilePicture')
        .populate('post', 'content image')
        .populate('comment', 'content');

    res.status(200).json({ notifications });
});

// Delete a notification by ID
export const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        to: user._id
    });

    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
});
    