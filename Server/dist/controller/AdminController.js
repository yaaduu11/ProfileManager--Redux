"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.editUsers = exports.getUserById = exports.getUsers = exports.adminSignIn = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userSchema_1 = require("../model/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.adminSignIn = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await userSchema_1.User.findOne({ email: email });
    if (!admin) {
        res.status(400).json({ message: "User not found." });
        return;
    }
    if (admin.isAdmin !== true) {
        res.status(403).json({ message: "Not an admin, access denied." });
        return;
    }
    const isMatch = await bcrypt_1.default.compare(password, admin.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'Admin login successful',
    });
});
exports.getUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const users = await userSchema_1.User.find({ isAdmin: false });
    res.status(200).json({
        success: true,
        users,
    });
});
exports.getUserById = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const user = await userSchema_1.User.findById(userId);
    if (user) {
        res.json({ success: true, user });
    }
    else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});
exports.editUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { name, email, phone } = req.body;
    const user = await userSchema_1.User.findById(userId);
    if (user) {
        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();
        res.json({ success: true, message: 'User updated successfully' });
    }
    else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});
exports.deleteUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const user = await userSchema_1.User.findOneAndDelete({ _id: userId });
    if (user) {
        res.status(200).json({ success: true, message: 'User deleted successfully', user });
    }
    else
        res.status(404).json({ success: false, message: 'User not found' });
    return;
});
