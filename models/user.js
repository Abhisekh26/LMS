const mongoose = require("mongoose")
const validator = require('validator');
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
    emailId:{
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
    occupation:{
        type:String,
       enum:["Student","Teacher","Admin"]  ,
       default:"Student" ,
       required:true                     //weather student or teacher or admin
    },
    password:{
        type:String,
        required:true,
         },
    // EnrolledCourses:{
    //     type:[String]     //for student to store which courses they are enrolled in
    // },
    // CoursesOffered:{
    //     type:[String]       //for teacher to see which courses are tehy offering
    // },


    EnrolledCourses: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "courses"
}],

CoursesOffered: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "courses"
}],
    About:{
        type:String
    },
    ProfilePic:{
        type:String
    }

},{timestamps:true})
module.exports = mongoose.model("users",user)