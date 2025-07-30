const nodemailer = require("nodemailer");
require("dotenv").config();

async function mailsender(email, title, body) {

    try {
        // Step 1 - create transporter function using nodemailer [create transport function ]
        const transorter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        // Step 2 - Create Send Mail function 

        let info = await transorter.sendMail({
            from:"Study Notion || By Aditya ",
            to:email,
            subject:title,
            html:body
        })

        console.log(info)


    } catch (error) {
        console.log("Geting Error While sending the OTP")
        console.log(error)
    }

}

module.exports = mailsender;