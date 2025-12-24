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
courseAuth.get("/course/:id",authentication,rolecheck,async(req,res)=>{
   try{
    const courseId = req.params.id 
    const courseData = await courses.findById(courseId)
    res.send(courseData)
   }
   catch(err){
    res.status(400).send("Something went wrong")
   }

})
// PUT /courses/:id → Update course Only owner (Teacher)

// DELETE /courses/:id → Delete course  Only owner

// GET /courses → List all courses (for students and teachers)

module.exports = courseAuth


 