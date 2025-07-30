const mongoose = require("mongoose");

const RatingAndReviewsSchema = new mongoose.model({
user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
rating:{
    type:Number,
    required:true,
},

review:{
    type:String,
    required:true,

}

})

module.exports = mongoose.model("RatingAndReviews" , RatingAndReviewsSchema )