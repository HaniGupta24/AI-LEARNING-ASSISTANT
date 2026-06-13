import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// 404 handler — must be BEFORE the error handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404,
    });
});

// Global error handler — must be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});