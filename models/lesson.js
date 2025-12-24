const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({

  /* ---------------- CORE FIELDS (ALWAYS PRESENT) ---------------- */

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  lessonType: {
    type: String,
    enum: ["video", "pdf", "live"],
    required: true
  },

  order: {
    type: Number,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  isPreview: {
    type: Boolean,
    default: false
  },

  published: {
    type: Boolean,
    default: false
  },

  /* ---------------- VIDEO LESSON ---------------- */

  video: {
    duration: Number, // in seconds

    sources: {
      "360p": String,
      "720p": String,
      "1080p": String
    }
  },

  /* ---------------- PDF LESSON ---------------- */

  pdf: {
    fileUrl: String,
    allowDownload: {
      type: Boolean,
      default: false
    },
    pageCount: Number
  },

  /* ---------------- LIVE LESSON ---------------- */

  live: {
    startTime: Date,
    endTime: Date,

    liveStatus: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled"
    },

    meetingLink: String,

    recordingAvailable: {
      type: Boolean,
      default: false
    },

    recordingSources: {
      "360p": String,
      "720p": String,
      "1080p": String
    }
  }

}, { timestamps: true })

module.exports = mongoose.model("lessons", lessonSchema)
