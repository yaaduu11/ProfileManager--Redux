"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/signIn');
    }
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        jsonwebtoken_1.default.verify(token, jwtSecretKey);
        next();
    }
    catch (error) {
        return res.redirect('/signIn');
    }
};
exports.isAuthenticated = isAuthenticated;
