const mongoose = require("mongoose")

const TagsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true        
    },

    discripction:{
      type:String,
    },

    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
})

module.exports = mongoose.model("Tags" , TagsSchema)