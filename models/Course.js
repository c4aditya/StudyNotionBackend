const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

     course:{
        type:String,
        trim:true,
     },

     courseDiscripction:{
        type:String,
        trim:true,
     },

     insturctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
     },

     whatYouWillLurn:{
      type:String,
     },

     language:{
       type:String,
       require:true,
     },

     price:{
      type:Number,
     },

     thumbnail:{
      type:String,
     },

     tags:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Tags"
     },


// Each and ever course content is made up with diffrent - diffrent section thats why it will take section as a refrence 
// ex - python - section 1  - Basics  , section - 2 - [if else] , section - 3 [loop ] etc 
     courseContent:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Section"

     }],

     enrollStudentData:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
     }],

     ratingAndReviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"RatingAndReviews"
     }]

     
   

})

module.exports = mongoose.model("Course", courseSchema)