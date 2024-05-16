require('dotenv').config();
const app = require('./app');
const connectWithDB = require('./config/db');
const cloudinary = require('cloudinary').v2


//connect with DB
connectWithDB();

//cloudinary config goes here

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

app.listen(process.env.PORT,() =>{
    console.log(`Server is running at ${process.env.PORT}`);
});