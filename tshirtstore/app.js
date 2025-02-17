require('dotenv').config();
const express = require('express')
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUplaod = require('express-fileupload');

//for swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require("yamljs");
const swaggerDocument = YAML.load('./swagger.yaml');
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));


//regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//temp check
app.set('view engine', "ejs");

//cookies and fileUpload middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp'
}));
//morgan middleware
app.use(morgan("tiny"));

//import all routes
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');



app.get('/signuptest',(req,res)=>{
    res.render('signuptest')
})






//router middleware
app.use('/api/v1',home);
app.use('/api/v1',user);
app.use('api/v1',product);


//export app.js
module.exports = app;