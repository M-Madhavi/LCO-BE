const User = require('../models/user');
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const cloudinary = require('cloudinary')
const mailHelper = require('../utils/emailHelper')

exports.signup = BigPromise(async (req, res, next) => {
    //let result;
    console.log(req.body);
    if (!req.files) {
      return next(new CustomError("photo is required for signup", 400));
    }
  
    const { name, email, password } = req.body;
  
    if (!email || !name || !password) {
      return next(new CustomError("Name, email and password are required", 400));
    }
  
    let file = req.files.photo;
  
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  
    const user = await User.create({
      name,
      email,
      password,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });
  
    cookieToken(user, res);
  });

  exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;
  
    // check for presence of email and password
    if (!email || !password) {
      return next(new CustomError("please provide email and password", 400));
    }
  
    // get user from DB
    const user = await User.findOne({ email }).select("+password");//since in model we made it false,so we are adding it here
  
    // if user not found in DB
    if (!user) {
      return next(
        new CustomError("Email or password does not match or exist", 400)
      );
    }
  
    // match the password(check with user from DB)
    const isPasswordCorrect = await user.isValidatedPassword(password);
  
    //if password do not match
    if (!isPasswordCorrect) {
      return next(
        new CustomError("Email or password does not match or exist", 400)
      );
    }
  
    // if all goes good and we send the token
    cookieToken(user, res);
  });


  exports.logout = BigPromise(async (req,res,next) => {
    //jwt is stateless and can't be removed/deleted it expires based on the expire time,so we just remove it from the place whereever we added
    
    //clearing/updating the token by making token = null 
    res.cookie('token',null,{
      expires : new Date(Date.now()),
      httpOnly : true
    })
    res.status(200).json({
      success:true,
      message:"Logout successfull!"
    });
  });

  exports.forgotPassword = BigPromise(async (req, res, next) => {
    // collect email
    const { email } = req.body;
    console.log(email);
    // find user in database
    const user = await User.findOne({ email });
  
    // if user not found in database
    if (!user) {
      return next(new CustomError("Email not found as registered", 400));
    }
  
    //get token from user model methods
    const forgotToken = user.getForgotPasswordToken();
  
    // save user fields in DB
    await user.save({ validateBeforeSave: false });
  
    // create a URL
    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
  
    //URL for deployment as front end might be running at different URL
    // const myUrl = `${process.env.FRONT_END}/password/reset/${forgotToken}`;
  
    // craft a message
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
  
    // attempt to send email
    try {
      await mailHelper({
        email: user.email,
        subject: "LCO TStore - Password reset email",
        message,
      });
  
      // json reponse if email is success
      res.status(200).json({
        succes: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      // reset user fields if things goes wrong
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });
  
      // send error response
      return next(new CustomError(error.message, 500));
    }
  });


  exports.getLoggedInUser = BigPromise(async (req,res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success:true,
      user
    })
   
  });

  exports.changePassword = BigPromise(async (req,res,next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password")
    //oldpassword
    const IsCorrectPassword = await user.isValidatedPassword(req.body.oldPassword);
    if(!IsCorrectPassword){
      return next(new CustomError("old password is incorrect", 400));
    }
    user.password = req.body.newPassword;
    await user.save
    cookieToken(user,res);
    res.status(200).json({
      success:true,
      user
    })
   
  });


  exports.updateUserDetails = BigPromise(async (req,res,next) => {

    const {name,email} = req.body;

    if(!(name || email)){
      return next(new CustomError("Name or email is missing",400))
    }

    const newData ={
      name :name,
      email:email
    };
    if(req.files && req.files.photo !== ''){
      const user = await User.findById(req.user.id);
      const imageId = user.photo.id;
      //delete photo on clodinary
      const resp = await cloudinary.v2.uploader.destroy(imageId);
      //upload the new photo
      const result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url
    }

    }
    const user = await User.findByIdAndUpdate(req.user.id,newData,{
      new:true,
      runValidators:true,
      useFindAndModify:false
    })
    res.status(200).json({
      success:true,
      user
    })
   
  });


  exports.adminAllUser = BigPromise(async (req,res,next) => {
    const users = await User.find()

    res.status(200).json({
      success:true,
      users
    })
   
  });




















// exports.signup = BigPromise(async (req, res, next) => {
//     let result
//     if (req.files) {
//         let file = req.files.photo;
//         result  = await cloudinary.v2.uploader.upload(file.tempFilePath, {
//             folder: "users",
//             width: 150,
//             crop: "scale",
//           });
        
//     }



//     const { name, email, password } = req.body;
//     if (!email || !name || !password) {
//         return next(new customError('Name,email and password is required', 400))
//     };

//     const user = await User.create({
//         name, 
//         email,
//         password,
//         photo:{
//             id:result.public_id,
//             secure_url:result.secure_url
//         }
//     });

//     cookieToken(user, res);
//     // const token = user.getJwtToken();
//     // const options = {
//     //     expires:new Date(Date.now() + 3 *24 *60 *60 *1000),
//     //     httpOnly : true
//     // }

//     // res.status(200).cookie('token',token,options).json({
//     //     success:true,
//     //     token,
//     //     user
//     // })

// })
