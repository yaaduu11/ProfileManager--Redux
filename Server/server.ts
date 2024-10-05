import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoute from "./route/UserRoute";
import adminRoute from "./route/AdminRoute"
import path from 'path';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoute);
app.use('/admin', adminRoute)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send("hello world");
});

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);  
});