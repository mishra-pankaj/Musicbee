const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const rateLimit = require("../utils/rateLimiter");

async function registerUser(req,res){
    const {username,email,password,role="user"} = req.body  

    const isUserAlreadyExist = await userModel.findOne({
       $or:[
        {username},
        {email}
       ]
    })
    if(isUserAlreadyExist) 
        return res.status(409).json({
            message:"User with email or username already exists"
        })
    
    //email and password validation 
    if(!validator.isEmail(email)){
        return res.status(400).json({
            message:"Invalid email"
        })
    }
    if(password.length<8)
        return res.status(400).json({
            message:"Password must be at least 8 characters long"
        })
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    })
    const token = jwt.sign({
        id: user._id,
        role: user.role,

    },process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token",token)
    res.status(200).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

    })
       
}

async function loginUser(req,res){
    try{
        const key = `login:${req.ip}`
        const allowed = await rateLimit(key, 5, 60)

        if(!allowed){
            console.log("Too many login attempts from this IP.");
            return res.status(429).json({
                message: "Too many login attempts."
            })
        }
        const {username,email,password} = req.body
        const user = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(!user)
            return res.status(401).json({
                message: "Invalid credentials"
            })
        
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Invalid xcredentials"
            })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        },process.env.JWT_SECRET,{expiresIn: "1d"})
        
        res.cookie("token",token)

        res.status(200).json({
            message: "User logged in successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

async function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })
}



module.exports = {
    registerUser,
    loginUser,
    logoutUser
    
}
