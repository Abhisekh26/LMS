const express = require("express")
const users = require("../models/user")
const userAuth = express.Router()
userAuth.post("/signup",async(req,res)=>{
    const user =new users(req.body)
    console.log(user)
    await user.save() 
    res.send("user saved")
   
})

module.exports = userAuth