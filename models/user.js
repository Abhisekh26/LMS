const mongoose = require("mongoose")
var validator = require('validator');
const user = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxlength:15
    },
    lastName:{
        type:String,
        required:true,
        maxlength:15
    },
    emailID:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate: function (value){
        if(!validator.isEmail(value)){
            throw Error("enter valid email id ")
        }
    }
    },
    Occupation:{
        type:String,
       enum:["Student","Teacher","Admin"]     //weather student or teacher or admin
    },
    password:{
        type:String,
        required:true
    },
    EnrolledCourses:{
        type:[String]     //for student to store which courses they are enrolled in
    },
    CoursesOffered:{
        type:[String]       //for teacher to see which courses are tehy offering
    },
    About:{
        type:String
    },
    ProfilePic:{
        type:String
    }

},{timestamps:true})
module.exports = mongoose.model("users",user)