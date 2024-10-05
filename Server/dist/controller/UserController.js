"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.editUser = exports.imageUpload = exports.getUserData = exports.signIn = exports.insertUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userSchema_1 = require("../model/userSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { RequestHandler } from 'express';
exports.insertUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, phone, password } = req.body;
    const isUser = await userSchema_1.User.findOne({ email: email });
    if (isUser) {
        res.status(400).json({ message: 'This email is already used' });
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = new userSchema_1.User({
        name,
        email,
        phone,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});
// export const signIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;
//             const data = {
//                 email: user.email,
//                 userId: user._id, 
//             };
//             const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });
//             res.cookie('jwt', token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production', 
//                 maxAge: 3600000,
//                 sameSite: 'strict',
//             });
//             res.status(200).json({
//                 success: true,
//                 message: 'Login successful',
//                 userData: {
//                     email: user.email,
//                     name: user.name,
//                     phone: user.phone,
//                 },
//             });
//         } else {
//             res.status(400).json({ message: 'Email or password is incorrect' });
//         }
//     } else {
//         res.status(400).json({ message: 'Email or password is incorrect' });
//     }
// });
exports.signIn = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userSchema_1.User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            const data = {
                userId: user._id,
            };
            const token = jsonwebtoken_1.default.sign(data, jwtSecretKey, { expiresIn: '1h' });
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
        }
        else {
            res.status(400).json({ message: 'Email or password is incorrect' });
        }
    }
    else {
        res.status(400).json({ message: 'Email or password is incorrect' });
    }
});
// export const getUserData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const token = req.cookies.jwt;
//     if (!token) {
//         res.status(401).json({ message: 'Unauthorized' });
//         return;
//     }
//     try {
//         const jwtSecretKey: Secret = process.env.JWT_SECRET_KEY as Secret;
//         const decoded = jwt.verify(token, jwtSecretKey) as { email: string };
//         const user = await User.findOne({ email: decoded.email }).select('-password'); 
//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }
//         res.status(200).json({
//             email: user.email,
//             name: user.name,
//             phone: user.phone,
//             imageURL: user.imageURL || 'https://via.placeholder.com/150'
//         });
//     } catch (error: any) {
//         res.status(500).json({ message: 'Failed to retrieve user data', error: error.message });
//     }
// });
exports.getUserData = (0, express_async_handler_1.default)(async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        const user = await userSchema_1.User.findById(decoded.userId).select('-password');
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user data', error: error.message });
    }
});
exports.imageUpload = (0, express_async_handler_1.default)(async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        const user = await userSchema_1.User.findById(decoded.userId);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
});
exports.editUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, phone } = req.body;
    const token = req.cookies.jwt;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
    const user = await userSchema_1.User.findById(decoded.userId).select('-password');
    const updatedUser = await userSchema_1.User.findByIdAndUpdate(user._id, { name, email, phone }, { new: true });
    res.status(200).json({ success: true, user: updatedUser });
});
exports.signOut = (0, express_async_handler_1.default)(async (req, res) => {
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
