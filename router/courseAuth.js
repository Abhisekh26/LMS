const express = require("express")
const courseAuth = express.Router()
const { authentication } = require("../middleware/auth")
const { rolecheck } = require("../middleware/roleauth")
const courses = require("../models/courses")



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

// GET /courses/:id → Get course details
courseAuth.get("/course/:id", authentication, rolecheck, async (req, res) => {
    try {
        const courseId = req.params.id
        const courseData = await courses.findById(courseId)
        res.send(courseData)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})


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


