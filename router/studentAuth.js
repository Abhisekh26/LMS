const express = require("express")
const studentAuth = express.Router()
const users = require("../models/user")
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