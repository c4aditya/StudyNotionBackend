const User = require("../models/User");
const bcrypt = require("bcrypt")
const mailSender = require("../utils/mailSender");


async function resetPasswordToken(req ,res){
    try{

        // email for req ki body 
        // chek user present or not 
        // generate the token 
        //  update user by adding token and expiration time 
        // create url 
        // send mail containing the url 
        // return responce 


        // get email 

        const {email} = req.body;

        // check validation 

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"This user is not exist please make sure you have an accout first "
            })
        }

        // generate toekn 
        // toekn ka use kr kehume user ki entry me lana hoga 
        const token = crypto.randomUUID();
        const updatePassword = await User.findByIdAndUpdate({email:email},
                                                             {
                                                                token : token,
                                                                resetPasswordExp:Date.now() + 5 * 60 *1000
                                                             },
                                                             {new:true}  // with new true we get updated documents 
        )

        // creating a url 

        const url = `http://localhost:3000/update=password/${token}`;


        // sending a mail 

        await mailSender(email , 
            "Password Resent Link",
            `Password Reset Link ${url}`)

            // return responce 

            return res.status(201).json({
                success:true,
                message:"Password is send to your regestried email please check and then reset the password ",
            })


    }catch(error){

        console.log(error)
        
        return res.status(500).json({
            sucess:false,
            message:" Some thing went wrong while creating a toekn for resent password  "
        })
        

    }
}


async function resetPassword(req ,res){

    try{

        // fetch data 1 -toekn , password and confirm passowrd 
        // validation 
        // Get user details for db using token 
        // token time check 
        // passord hasingh 
        // password update 
        // return responce 

        

        // feching the data 

        const { token , password ,confrimPassword} = req.body ;

        // validation 

        if(password !== confrimPassword){
            return res.status(401).json({
                sucess:false,
                message:"In reset - Password and Confirm password must be same "
            })
        }

        // get user details from DB as token 

        const userDetails = await User.findOne({token:token});

        if(!userDetails){
            return res.status(401).json({
                sucess:false,
                message:" Toekn is in valid "
            })
        }

        if(userDetails.resetPasswordExp <  Date.now()){
            return res.status(501).json({
                success:false,
                message:"Time reached plese reset your password again! "
            })
        }

        const hassingPassword = await bcrypt.hash(password , 10);

        await User.findByIdAndUpdate( {token : token }, {password:hassingPassword} , {new :true} );

        return res.status(200).json({
            sucess:true ,
            message:"Your new passeord is save successfully! "
        })
        


    }catch(error){

        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:"Getting error while reseting the password "
        })



    }

}

module.exports = {resetPassword , resetPasswordToken };