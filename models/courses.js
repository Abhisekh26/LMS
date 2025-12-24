const mongoose = require("mongoose")
const user = require("./user")
const courses =new mongoose.Schema({
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
 status:{
    type:String,
    enum:["finished","ongoing"],
    default:"ongoing"
    },
 level:{
    type:String,
    enum:["beginner","intermediate","advanced"],
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








