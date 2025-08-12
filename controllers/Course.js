const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadeImageToCloudnary } = require("../utils/imageUploader");


async function createCourse(req, res) {

    try {

        // fetch all the data 
        // fetch thumbnail image 
        // perform some validation 
        // check it's instructor or not 
        // check given tag is valid or not 
        // uploade the image to the cloudinary 
        // create a entry in the data base for new course 
        // update user means add the new course to the Instructor course list 

        // fetch data 
        const { courseName, courseDiscripction, insturctor, whatYouWillLurn, language, price, tags } = req.body;

        // fetch images 
        const { thumbnail } = req.files.thumbnailImage;

        // validation 

        if (!courseName || !courseDiscripction || !insturctor || !whatYouWillLurn || !language || !price || !tags || !thumbnail) {

            return res.status(500).josn({
                success: false,
                message: "Please fill all the input feilds it's nessessary "
            })

        }


        // check while it is instructor or not 

        const userId = req.user.id;
        const instructor_deatils = await User.findById({ userId });

        console.log("This is insructor details ")
        console.log(instructor_deatils);

        if (!instructor_deatils) {
            return res.status(500).json({
                sucess: false,
                message: "Instructor details not found "
            })
        }


        // check the tag is valid or not 

        const tagDetails = await Tag.findById({ tags });

        if (!tagDetails) {
            return res.status(404).josn({
                sucess: false,
                message: "Tag are not founds pleas provide the tags"
            })
        }

        //uploade the imgae to cloudinary 

        const thumbnailImage = await uploadeImageToCloudnary(thumbnail, process.env.FOLDER_NAME);

        // create an entry to the data base for the new course 

        const newCourse = await Course.create({
            courseName,
            courseDiscripction,
            insturctor: instructor_deatils._id,
            whatYouWillLurn: whatYouWillLurn,
            price,
            tags: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,

        })

        console.log(newCourse);


        // update / add user means add the new course to the Instructor course list 

        await User.findByIdAndDelete(

            { _id:instructor_deatils._id },
            {
                $push :{
                      courses : newCourse._id
                }
            },
            {new:true},
        );

        // update the tag schema  HW 

        // return responce 
        return res.status(200).josn({
            success:true,
            message:"Course Created Sucessfully",
            data:newCourse
        })
       




    } catch (error) {

        console.log(error);
        return res.status(500).josn({
            sucess:false,
            message:"Failed for creating a course please try again later ",
            
        })

    }

}


module.exports = createCourse;
