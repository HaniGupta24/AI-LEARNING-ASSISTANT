import  jwt from 'jsonwebtoken';
import User from '../models/User.js';

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES || "7d",
    });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({
            $or: [{ email }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};


//@desc login user
//@route POST /api/auth/login
//@access Public

export const login = async (req,res,next)=>{    
       try{

    }catch(error){
        next(error);
    }
};

//@desc get user profile
//@route GET /api/auth/profile
//@access Private
export const getProfile = async (req,res,next)=>{
       try{

    }catch(error){
        next(error);
    }
};


//@desc update user profile
//@route PUT /api/auth/profile
//@access Private
export const updateProfile = async (req,res,next)=>{
       try{

    }catch(error){
        next(error);
    }
};

//@desc change user password    
//@route POST /api/auth/change-password
//@access Private
export const changePassword = async (req,res,next)=>{
       try{

    }catch(error){
        next(error);
    }
};

