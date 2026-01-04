const express = require("express")
const courseAuth = express.Router()
const { authentication } = require("../middleware/auth")
const { rolecheck } = require("../middleware/roleauth")
const courses = require("../models/courses")
const lessons = require('../models/lesson')



// POST /courses → Create a course, Only Teacher role, must include course name, price, level, description, thumbnail
courseAuth.post("/course", authentication, rolecheck, async (req, res) => {
    try {
        const occupation = req.user.occupation
        if (occupation !== "Teacher") {
            return res.send("invalid credentials")
        }
        const { name, price, level, description, thumbnail } = req.body
        const newCourse = new courses({
            name, price, level, description, thumbnail, createdBy: req.user._id
        })
        await newCourse.save()
        res.send("done")
    }
    catch (err) {
        res.status(400).send("something went wrong")
    }

})




// GET /courses/:id → Get course details,all lessons in the course
courseAuth.get("/course/:id", authentication, async (req, res) => {
    try {
        const courseId = req.params.id
        // console.log(courseId)
        const courseData = await courses.findById(courseId).populate("createdBy","firstName lastName")
        const lessonData = await lessons.find({courseId:courseId})
        res.send({courseData,lessonData})
    }
    catch (err) {
        res.status(400).send(err)
    }

})


// get all courses created by a teacher 
courseAuth.get("/my-courses", authentication, async (req, res) => {
    console.log("happy")
  try {
    if (req.user.occupation !== "Teacher") {
      return res.status(403).send("Access denied");
    }

    const teacherId = req.user._id;
    console.log(teacherId)

    const myCourses = await courses.find({ createdBy: teacherId })
      .sort({ createdAt: -1 });
      console.log(myCourses)

    res.status(200).json(myCourses);
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
});



// PUT /courses/:id → Update course Only owner (Teacher)  // abug is here ,teacher user schema offered courses should update 

courseAuth.patch("/course/:id",authentication,rolecheck,async(req,res)=>{
    try{
        const occupation = req.user.occupation 
        if(occupation !== "Teacher"){
            return res.send("Not valid")
        }
        const courseid = req.params.id 
        const userid= req.user._id
        const updateCourse= await courses.findOneAndUpdate({_id:courseid,createdBy: userid},req.body)
       if(!updateCourse){
        return res.send("Invalid request")
       }
        res.send("done")
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})

// DELETE /courses/:id → Delete course  Only owner
courseAuth.delete("/course/:id", authentication, rolecheck, async (req, res) => {
    try {
        const occupation = req.user.occupation
        if (occupation !== "Teacher") {
            return res.send("Something went wrong")
        }
        const userid = req.user._id
        const id = req.params.id
        const deletecourse = await courses.findOneAndDelete({
            _id: id,
            createdBy: userid
        })
        if(deletecourse === null){
            return res.send("Something went wrong")
        }
        res.send("Course deleted successfully")
    }
    catch (err) {
        res.status(400).send("Could not delete")
    }
})
// GET /courses → List all courses (for students and teachers)
courseAuth.get("/courses", authentication, async (req, res) => {
    try {
        const data = await courses.find()
        res.send(data)
    }
    catch (err) {
        res.status(400).send("something went wrong")
    }
})
module.exports = courseAuth


