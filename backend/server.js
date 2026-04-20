import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { protect } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';


//ES6 module_dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Intialize Express app
const app = express();

//Connect to MongoDB
connectDB();

//Middleware TO handle cors
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true,
}
));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Stati folder for uploafded files
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//Routes
app.use('/api/auth',authRoutes);

app.use(errorHandler);

//404 HANDLER
app.use((req,res,next)=>{
    res.status(404).json({
        success:false,
        error:"Route not found",
      statusCode:404,
    });
});

//start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server is running in ${process.env.NODE_ENV} node on port ${PORT}`);
});

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`);
    process.exit(1);
});
