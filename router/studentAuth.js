const express = require("express")
const studentAuth = express.Router()
const users = require("../models/user")
const courses = require("../models/courses")
const lessons = require("../models/lesson")
const { authentication } = require("../middleware/auth")


// GET /courses → List all available courses
studentAuth.get("/course", authentication, async (req, res) => {
    try {
        const allcourses = await courses.find()
        res.send(allcourses)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})


// GET /courses/:id/lessons → List all lessons in a course (respect isPreview and enrollment)
studentAuth.get("/course/:id/lessons",authentication,async(req,res)=>{
 try{
    const courseid = req.params.id
    const enrolledCourses = req.user.EnrolledCourses.toString().includes(courseid.toString())
    let classData
    if(enrolledCourses){
    classData = await lessons.find({courseId:courseid}).sort({order:1})
             return res.send(classData)
    }
    else {
        classData = await lessons.find({courseId:courseid ,isPreview: true}).sort({order:1})
           return   res.send(classData)
        }

       if(!enrolledCourses){
        return res.send("oops")
       }
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//get//particular enrolled course of a student


  
// POST /enroll/:courseId → Enroll in a course
studentAuth.post("/enroll/:courseId", authentication, async (req, res) => {
    try {
        const courseId = req.params.courseId
        const studentId = req.user._id
        if (req.user.occupation !== "Student") {
            return res.send("invalid credentials")
        }
        await users.findByIdAndUpdate(studentId, { $addToSet: { EnrolledCourses: courseId } })
        res.send("updated")
    }
    catch (err) {
            res.status(400).send("Something went wrong")
        }
    })

// GET /progress/:courseId → Get progress for the student (later)

module.exports = studentAuth