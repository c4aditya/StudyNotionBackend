const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,        
    },

    gneratedOTP:{
        type:Number,
        required:true,
    },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
     }
})

// OTP Send code after schema and Before Model [Pre middle wares]

async function sendVarificationEmail(email , otp) {
    try{
      const mailResponce = await mailsender(email , "Varification email form Study Notion " , otp);
      console.log(`mail send sucessfully to ${email} please check Your email `)
      console.log(mailResponce)
    }catch(error){
        console.log("Geting Problem in OTP schema Pre Middle ware function ")
        console.log(error)
    }
}

module.exports = mongoose.model("OTP" , OTPSchema)