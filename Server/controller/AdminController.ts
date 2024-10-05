import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { User } from '../model/userSchema';
import bcrypt from 'bcrypt';

export const adminSignIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email });

    if (!admin) {
        res.status(400).json({ message: "User not found." });
        return;
    }
    if (admin.isAdmin !== true) {
        res.status(403).json({ message: "Not an admin, access denied." });
        return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'Admin login successful',
    });
});

export const getUsers = asyncHandler(async(req:Request, res:Response):Promise<void> => {
    const users = await User.find({isAdmin:false})

    res.status(200).json({
        success: true,
        users,
    });
})

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
});

export const editUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email, phone } = req.body;
  
    const user = await User.findById(userId);
  
    if (user) {
      user.name = name;
      user.email = email;
      user.phone = phone;
      await user.save();
  
      res.json({ success: true, message: 'User updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
});

export const deleteUsers = asyncHandler(async(req:Request, res:Response): Promise<void> => {
    const { userId } = req.params

    const user = await User.findOneAndDelete({_id:userId})

    if(user) {
        res.status(200).json({ success: true, message: 'User deleted successfully', user });
    }else res.status(404).json({ success: false, message: 'User not found' });

    return;
})