import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { User, IUser } from '../model/userSchema';
import jwt, {Secret} from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const insertUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, password } = req.body;

    const isUser = await User.findOne({ email: email });
    if (isUser) {
        res.status(400).json({ message: 'This email is already used' });
        return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name, 
        email,
        phone,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error:any) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

export const signIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;

            const data = {
                userId: user._id,
            };

            const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 3600000,
                sameSite: 'strict',
            });
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                userData: {
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                },
            });
        } else {
            res.status(400).json({ message: 'Email or password is incorrect' });
        }
    } else {
        res.status(400).json({ message: 'Email or password is incorrect' });
    }
});

export const getUserData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;

        const decoded = jwt.verify(token, jwtSecretKey) as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            email: user.email,
            name: user.name,
            phone: user.phone,
            imageURL: user.imageURL
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve user data', error: error.message });
    }
});

export const imageUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;
        const decoded = jwt.verify(token, jwtSecretKey) as { userId: string };

        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        user.imageURL = `${req.file.filename}`; 
        await user.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageURL: user.imageURL
        });
    } catch (error:any) {
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
});

export const editUser = asyncHandler(async(req:Request, res:Response)=>{
    const { name, email, phone } = req.body;
    const token = req.cookies.jwt;

    const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;
    const decoded = jwt.verify(token, jwtSecretKey) as { userId: string };

    const user : any = await User.findById(decoded.userId).select('-password');

    const updatedUser = await User.findByIdAndUpdate(user._id, { name, email, phone }, { new: true });
    res.status(200).json({ success: true, user: updatedUser });
})

export const signOut = asyncHandler(async (req: Request, res: Response): Promise<void> => {    
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({
        success: true,
        message: 'Successfully logged out',
    });
});