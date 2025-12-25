const express = require("express")
const lessonAuth = express.Router()
const { authentication } = require("../middleware/auth")
const { rolecheck } = require("../middleware/roleauth")
const courses = require("../models/courses")
const lessons = require("../models/lesson")



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


// # PUT /lessons/:id → Update lesson,  Add recordings for live lessons,Change video/pdf files if needed

lessonAuth.patch("/lessons/:id", authentication, rolecheck, async (req, res) => {
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


// # DELETE /lessons/:id → Remove lesson


module.exports = lessonAuth