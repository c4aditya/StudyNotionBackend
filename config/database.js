const mongoose = require("mongoose")
require("dotenv").config();

 function  Db_connection(){

    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Data Base connected sucessfully !");    
    }).catch((error)=>{
        console.log("Getting error while make connection with the data base ")
        console.log(error)
    })
}

module.exports = Db_connection ;
