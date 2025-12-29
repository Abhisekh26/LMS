const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },

  completedLessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lessons"
    }
  ],

  totalLessons: {
    type: Number,
    required: true
  }

}, { timestamps: true })

progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true })

module.exports = mongoose.model("progress", progressSchema)
