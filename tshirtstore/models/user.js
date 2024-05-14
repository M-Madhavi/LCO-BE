const { select } = require('@ngrx/store');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
 name:{
    type : String,
    required : [true,'Please provide a name'],
    maxlength : [40,'Name should not exceed 40 characters']
 },
 email:{
    type : String,
    required : [true,'Please provide an email'],
    validate : [validator.isEmail,'Please enter email in correct format'],
    unique : true
 },
 password:{
    type : String,
    required : [true,'Please provide an password'],
    maxlength : [6,'Password should be atleast 6 characters'],
    select : false //when you fetch user password will not be shown ,instead of making it undefined in code got get request
 },
 role:{
    type : String,
    default : 'user'
 },
 photo:{
    id : {
        type : String,
        required :true
    },
    secure_url : {
        type : String,
        required :true
    }
 },
 role:{
    type : String,
    default : 'user'
 },
 forgotPasswordToken : String,
 forgotPasswordExpiry : Date,
 createdAt :{
    type :Date,
    default : Date.now
 }
})


module.exports = mongoose.model('User',userSchema)//they are always converted to lowercase by mongoose ,so define as you wish