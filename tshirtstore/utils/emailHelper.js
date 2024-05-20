const nodemailer = require("nodemailer");
require('dotenv').config();

const mailHelper = async (options) => {
    console.log(options);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });
    const message = {
        from: 'madhavi@dev.pro',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: "<a>Hello world?</a>", 
    };

    // send mail with defined transport object
    await transporter.sendMail(message);

    // try {
    // } catch (error) {
    //     console.error("Error sending email: ", error);
    // }


}


module.exports = mailHelper;