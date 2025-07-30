const mongoose = require("mongoose");

const subSectionsSchema = new mongoose.Schema({

    title:{
        type:String,        
    },

    timeDurection:{
        type:String,        
    },

    discripction:{
        type:String,        
    },

    vidoURL:{
        type:String
    }
   

})

module.exports = mongoose.model("SubSections", subSectionsSchema)