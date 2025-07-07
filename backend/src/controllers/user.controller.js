import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { clerkClient, getAuth } from '@clerk/express';

export const getUserProfile = asyncHandler(async (req,res) => {
    const { username } = req.params;
    // Simulate fetching user profile from a database
    const user = await User.findOne({ username });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
      new: true,
      upsert: true,
    });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    // Assuming req.body contains the updated user data
    res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    // Simulate syncing user data with Clerk and check if user exists already
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
        res.status(200).json({ user: existingUser, message: 'User already exists' });
        return;
    }
    //Create a new user from Clerk data
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        username: clerkUser.emailAddresses[0].emailAddress.split('@')[0] || `user-${userId}`, // Fallback username
        profilePicture: clerkUser.imageUrl || '',
    };

    const user = await User.create(userData);
    res.status(201).json({ user, message: 'User created successfully' });
});