const mongoose = require("mongoose")
const user = require("./user")
const course =new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
  price: {
    type:Number,
    required:true,
    default: 0
   },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true
 },



// ✅ ADD THIS
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],

  
  totalRevenue: {
    type: Number,
    default: 0
  },
// 




 status:{
    type:String,
    enum:["finished","ongoing"],
    default:"ongoing"
    },
 level:{
    type:String,
    enum:["Beginner","Intermediate","Advanced"],
    required:true
 },
 coursedescription:{
    type:String,
    maxlength:150
 },
thumbnail:{
    type:String
}


},{timestamps:true})



module.exports= mongoose.model("courses",course)




