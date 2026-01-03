const express = require("express")
const lessonAuth = express.Router()
const { authentication } = require("../middleware/auth")
const { rolecheck } = require("../middleware/roleauth")
const courses = require("../models/courses")
const lessons = require("../models/lesson")

//  get class detail

lessonAuth.get("/lesson/:lessonId", authentication, async (req, res) => {
  const lesson = await lessons.findById(req.params.lessonId);
  res.send(lesson);
});


// # These let teachers add lessons to a course:, POST /lessons → Add lesson, video/pdf/live, For live, include start/end + meeting link

lessonAuth.post("/course/:idcourse/lesson", authentication, rolecheck, async (req, res) => {
    try {
        if (req.user.occupation !== "Teacher") {
            return res.send("Not authorised")
        }
        const courseId = req.params.idcourse
        const courseExist = await courses.findById(courseId)
        if (!courseExist) {
            return res.send("No such course Exist")
        }
        if (courseExist.createdBy.toString() !== req.user._id.toString()) {
            return res.send("Invalid Owner request")
        }

        const {
            title,
            lessonType,
            order,
            isPreview,
            video,
            pdf,
            live
        } = req.body
        const newLesson = new lessons({
            courseId,
            title,
            lessonType,
            order,
            isPreview,
            createdBy: req.user._id,
            video,
            pdf,
            live
        })
        await newLesson.save()
        res.send("Done")

    } catch (err) {
        res.status(400).send(err.message)
    }
})


// # PATCH /lessons/:id → Update lesson,pdf files if needed

lessonAuth.patch("/lessons/:id/pdf", authentication, rolecheck, async (req, res) => {
    try {
        const lessonid = req.params.id
        const { fileUrl, allowDownload, pageCount } = req.body
        if (req.user.occupation !== "Teacher") {
            return res.send("Invalid occupation")
        }
        let lessonDetails = await lessons.findById(lessonid)
        if (!lessonDetails) {
            return res.send("no such lesson exist")
        }
        if (lessonDetails.createdBy.toString() !== req.user._id.toString()) {
            return res.send("Unauthorised access")
        }
        lessonDetails.pdf = {
            fileUrl,
            allowDownload,
            pageCount
        }
        await lessonDetails.save()
        res.send("done")
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

// # PATCH /lessons/:id → Update lesson,video files if needed

lessonAuth.patch("/lessons/:id/video", authentication,rolecheck, async (req, res) => {
  try {
    if (req.user.occupation !== "Teacher") {
      return res.status(403).send("Invalid occupation")
    }

    const lessonId = req.params.id
    const { duration, sources } = req.body

    const lesson = await lessons.findById(lessonId)
    if (!lesson) {
      return res.status(404).send("Lesson not found")
    }

    if (lesson.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized access")
    }

    if (lesson.lessonType !== "video") {
      return res.status(400).send("This lesson is not a video lesson")
    }

    lesson.video = {
      duration,
      sources
    }

    await lesson.save()
    res.send("Video uploaded successfully")

  } catch (err) {
    res.status(400).send(err.message)
  }
})

// # PATCH /lessons/:id → Update lesson,video files if needed

// # DELETE /lessons/:id → Remove lesson
lessonAuth.delete("/lessons/:id", authentication, rolecheck, async (req, res) => {
    try {
        if (req.user.occupation !== "Teacher") {
            return res.send("Invalid occupation")
        }
        const userid = req.user._id
        const lessonid = req.params.id
        const deletedLesson = await lessons.findOneAndDelete({ _id: lessonid, createdBy: userid })
        if (!deletedLesson) {
            return res.send("Lesson not found or unauthorized")
        }
        res.send("deleted")
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = lessonAuth