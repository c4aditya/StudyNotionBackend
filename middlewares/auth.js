const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User")




async function auth(req , res ,next){
try{
    // in side the auth function we basically perform the authrezation 
    // authentication is checked by json web tokens 



    //extract the toekns 
    const token = req.cookie.token || req.body.toekn || req.header["Authorisation"].replace("Bearer" , " ");


    // if token is missing return responce 

    if(!token){
        return res.status(401).json({
            sucess:false,
            message:"The Token is missing "
        })
    }

    // varify the token [by secrate key ]

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        console.log(decode)
        req.user = decode;
    }catch(error){

        // varifiation issue 
        return res.status(401).json({
            sucess:false,
            message:"Token is invalid "
        });

    }

    next();


}catch(error){

    res.status(401).json({
        sucess:false,
        message:"Some thing went wrong while in validation also check code!"
    })

}
}

// check it is student 

async function isStudent(){
    try{

    }catch(error){

    }
}