const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/customError");
const bigPromise = require("./bigPromise");


exports.isLoggedIn = bigPromise(async(req,res,next) =>{
    // const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");
    // console.log("token",token);
    console.log(`cookie-token: ${req.cookies.token}`);
    const token = req.cookies.token;
    if(!token){
        return next(new CustomError('Login first to access this page',401));
    }
    const decoded =  jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);//since in user model we used id to generate token we are using the same here->check this method in user model getJwtToken
    next();
})


exports.customRole =  (...roles) =>{
    return(req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new CustomError('You are not allowed to access this resource',403));
        }
        next();
    }
    
}