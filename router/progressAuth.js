const express = require("express")
const progress = require("../models/progress")
const lessons = require("../models/lesson")
const progressAuth = express.Router()
const{authentication}= require("../middleware/auth")

progressAuth.get("/progress/student", authentication, async (req, res) => {
  try {
    const studentId = req.user._id
    const enrolledCourses = req.user.EnrolledCourses

    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res.send("Enroll in courses first")
    }

    const progressData = await Promise.all(
      enrolledCourses.map(async (courseId) => {
        const data = await progress.findOne({
          studentId,
          courseId
        }).populate("completedLessons", "title order")

        return {
          courseId,
          completedLessons: data ? data.completedLessons : [],
          completedCount: data ? data.completedLessons.length : 0
        }
      })
    )

    res.send(progressData)

  } catch (err) {
    res.status(400).send(err.message)
  }
})

progressAuth.post("/progress/complete/:lessonId", authentication, async (req, res) => {
  try {
    if (req.user.occupation !== "Student") {
      return res.status(403).send("Only students can update progress")
    }

    const studentId = req.user._id
    const lessonId = req.params.lessonId

    const lesson = await lessons.findById(lessonId)
    if (!lesson) {
      return res.status(404).send("Lesson not found")
    }

    const courseId = lesson.courseId

    // Check enrollment
    const enrolled = req.user.EnrolledCourses.includes(courseId.toString())
    if (!enrolled) {
      return res.status(403).send("Enroll in course first")
    }

    // Count total lessons once
    const totalLessons = await lessons.countDocuments({ courseId })

    const progressData = await progress.findOneAndUpdate(
      { studentId, courseId },
      {
        $setOnInsert: { totalLessons },
        $addToSet: { completedLessons: lessonId }
      },
      { upsert: true, new: true }
    )

    res.send(progressData)

  } catch (err) {
    res.status(400).send(err.message)
  }
})


module.exports = progressAuth