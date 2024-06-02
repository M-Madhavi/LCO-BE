//token-Middleware-handling images

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [40, 'Name should not exceed 40 characters']
   },
   email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please enter email in correct format'],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Please provide an password'],
      maxlength: [6, 'Password should be atleast 6 characters'],
      select: false //when you fetch user password will not be shown ,instead of making it undefined in code got get request
   },
   role: {
      type: String,
      default: 'user'
   },
   photo: {
      id: {
         type: String,
         required: true
      },
      secure_url: {
         type: String,
         required: true
      }
   },
   role: {
      type: String,
      default: 'user'
   },
   forgotPasswordToken: String,
   forgotPasswordExpiry: Date,
   createdAt: {
      type: Date,
      default: Date.now
   }
})

//encrypt password before save -hooks
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      return next();
   }
   this.password = await bcrypt.hash(this.password, 10)
});

//validate the password withpassed on user password
userSchema.methods.isValidatedPassword = async function (usersentpassword) {
   return await bcrypt.compare(usersentpassword, this.password)
};

//method for creating and returning jwt

userSchema.methods.getJwtToken = function () {
   return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
   })
}

//generate forgot password token(string)
//generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function () {
   // generate a long and randomg string
   const forgotToken = crypto.randomBytes(20).toString("hex");

   // getting a hash - make sure to get a hash on backend
   this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

   //time of token
   this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

   return forgotToken;
};


module.exports = mongoose.model('User', userSchema);//they are always converted to lowercase by mongoose ,so define as you wish

// userSchema.methods.getForgotPasswordToken = function () {
//    //generate a random string -this is send to user
//    const forgotToken = crypto.randomBytes(20).toString('hex');
//    //getting a hash - make sure to get a hash on backend(this is stored in BE)
//    this.forgotPasswordToken = crypto.createHash('sha256'.update(forgotToken).digest('hex'));

//    //time of token
//    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;//20min
//    console.log("*****",forgotToken);

//    return forgotToken;

// }