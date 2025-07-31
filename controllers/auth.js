const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile")
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")

require("process").config();


//---------------------------------------------------------------------------------------------signup code ---------------------------------------------------------------------------------------------------------//

async function sendOTP(req, res) {

    try {
        // Step 1 - fetch email form request -> body 
        const { email } = req.body;

        // Step 2 - check is user already exist 
        const checkUserPresent = await User.findOne({ email });

        // Step 3 - if user already exist then return a responce 
        if (checkUserPresent) {
            return res.status(401).json({
                sucess: false,
                message: "User Already Exist"
            })
        }

        // Step -4  Generate OTP 
        // It will thake many things for generate an otp 
        // 1 - Totel length  2 - UpperCase , 3- Lower Case 
        const otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        console.log("OTP Generated ", otp)

        // Step - 5 -  OTP is unique or not 
        // we intersect with OTP data base 

        const otpResult = await OTP.findOne({ otp: otp })

        while (otpResult) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            otpResult = await OTP.findOne({ otp: otp })
        }

        // make entry to the data base 
        const payloade = { email, otp }

        // create an enty in DB for OTP 

        const otpBody = await OTP.create(payloade)
        console.log("Making OTP entry to the Data Base ", otpBody)

        // after making entry on the database return the responce  
        res.status(200).json({
            sucess: true,
            message: "OTP send Sucessfully !"
        })

    } catch (error) {

        console.log("Getting Error while Creating an OTP")
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Getting error while creating an OTP",
            data: error,
        })
    }

}


//------------------------------------------------- signup function---------------------------------------------------------------------

async function signup(req, res) {

    try {
        // data  fetch from req ki body 
        //data validate kro 
        // match both password create password == confrim password
        // check user is already exist or not 
        // find most resent otp for user 
        // hash the password 
        // and make entry into the data base 


        // data fetch        
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        // validate on the data 

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {

            return res.status(403).json({
                sucess: false,
                message: "All Feilds Are Required"
            })
        }

        // create password and confrim password are same or not 

        if (password !== confirmPassword) {
            return res.status(403).json({
                sucess: false,
                message: "Password and Confrim password Is not same Please make sure both are same "
            })
        }

        //check user is allready exist or not 

        const isUserExist = await User.findOne({ email })

        if (isUserExist) {
            return res.status(400).json({
                sucess: false,
                message: "User Already exsit please Login  "
            })
        }

        // find user most reset OTP that is generate 
        // imp 

        // Step 1 -  make db intrection with the OTP DB and find email for corresponding email
        // Step 2 - use sort function for getting most resent OTP 
        const resentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(resentOTP);

        // validate the OTP 
        if (resentOTP.length == 0) {
            return res.status(400).josn({
                sucess: false,
                message: "OTP not found"
            })
        } else if (resentOTP !== otp) {
            return res.status(400).josn({
                sucess: false,
                message: "OTP did not match"
            })
        }

        // bcrypt the password [Hash Password]

        const hashedPassword = await bcrypt.hash(password, 10);


        // Entry create in the data base 

        // creating a profile 
        const profileDetails = await Profile.create({
            gender: null,
            about: null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            otp,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${firstName}`,
        })

        console.log(user)


        return res.status(200).josn({
            sucess: true,
            message: "user is registered sucessfully",
            data: user,
        })




    } catch (error) {
        console.log("Getting Error while signup ")
        return res.status(500).json({
            sucess: false,
            message: "Getting error in signup code",
            data: error,
        })

    }

}

//----------------------------------------------------------------Login functio ------------------------------------------------------------------------------------------------

async function login(req, res) {

    try {
        // get data from request ki body 
        // perform some validation 
        // check user is signuped or not
        // if user is not signup then return resposce 
        // make sure password is same 
        // if user is signuped then create JWT tokens 
        // create cookie and send the responce 


        // get the data from request ki body 

        const { email, password } = req.body;

        // perform some validation 

        if (!email || !password) {
            return res.status(403).json({
                sucess: false,
                message: "Please fill all feilds please try again "
            })
        }

        // check user is already exit or not 

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                sucess: false,
                message: "User is not register please signup and try again"
            })
        }

        // compare the password 

        if (await bcrypt.compare(password, user.password)) {
            
            // if password is match then create a JWT token 
            // create a payloade 

            const payloade = {
                email: user.email,
                id: user._id,
                role: user.role
            }
            const token = JWT.sign(payloade, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            user.token = token;
            user.password = undefined;

            // create a cookie 
            // we have to create options 
            const options ={
                expiresIn:new (Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token" , token , options).status(200).json({
                sucess:true,
                token,
                user,
                message:"You Are logged in Sucessfully  "
            })

        } else {
            return res.status(401).json({
                sucess:false,
                message:"Password is not match please try again!"
            })
        }


    } catch (error) {
        console.log("Getting error while login check login controller code once ");
        console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Login Failer please try again "
        })

    }

}

// Change password 

async function changePassword(){

    try{

        // get email form the request ki body 
        // enter old password , new passeord and confrim password 
        // perforem some validation 
        // update the changed password in your db 
        // return responce 
     
        // geting the data from req ki body 
        const {email,oldPassword , newPassword , confirmPassword } = req.body
        // preform some validation 
        

    }catch(error){

        console.log(error)
        

    }
}