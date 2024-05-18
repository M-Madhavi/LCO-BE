const nodemailer = require("nodemailer");
require('dotenv').config();

const mailHelper = async (options) => {
    console.log(options);
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },tls: {
            rejectUnauthorized: false 
        }
    });
    const message = {
        from: 'madhavi@be.pro',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: "<a>Hello world?</a>", 
    };

    // send mail with defined transport object
    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.error("Error sending email: ", error);
    }


}


module.exports = mailHelper;