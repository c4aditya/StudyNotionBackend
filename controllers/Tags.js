const Tag = require("../models/Tags");


async function  creatingTags(req ,res){

    try{
       // fetching the data 
       // validation 
       // create enty iin db 
       // create an api for creating a tag 

       const {name , discripction} = req.body;


       // validation 

       if(!name || !discripction){
        return res.status(500).json({
            success:false,
            message:"Please fill the all the details first for creating an Tag "
        })
       }

       // create enty in db 
        const tagDetails = await Tag.create({
            name:name,
            discripction:discripction,
        })

        console.log(tagDetails);

        // return responce 

        return res.status(200).json({
            sucess:true,
            message:"Tag created successfully! "
        })
        

    }catch(error){
  
        return res.status(500).json({
            success:false,
            message:"Geting error while creating the tags "
        })
    }

}


// get all tags function

async function getallTags(req ,res){
    try{

        const allTags = await Tag.find({}, { name:true , discripction:true })
   
          res.status(200).json({

            success:true,
            message:" All tags return successfully! ",
            allTags,

          })
    }catch(error){

        console.log(error)
         return res.status(500).json({
            success:false,
            message:"Geting error while geeting all the tags "
        })


    }
}

module.exports = {getallTags , creatingTags};

