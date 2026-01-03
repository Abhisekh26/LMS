const express = require("express")
const users = require("../models/user")
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
const validator = require("validator")
const { authentication } = require("../middleware/auth")
const userAuth = express.Router()
userAuth.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password,occupation } = req.body
        const checkEmail = validator.isEmail(emailId)
        if (!checkEmail) {
            res.send("Enter a valid email")
        }
        const passwordhash = await bcrypt.hash(password, 10)

        const user = new users({ firstName, lastName, emailId,occupation, password: passwordhash })
        await user.save()
        res.send("done")
    }
    catch (err) {
        console.log("SIGNUP ERROR 👉", err)
        res.status(400).send(err.message)
    }

})


userAuth.post("/login", async (req, res) => {
    const { emailId, password } = req.body
    const isEmailValid = validator.isEmail(emailId)
    if (!isEmailValid) {
      return   res.send("Enter valid credentials")
    }
    const data = await users.findOne({ emailId: emailId })
    if (!data) {
       return res.send("Enter valid credentials")
    }
    const checkPassword = await bcrypt.compare(password, data.password)
    if (!checkPassword) {
       return res.send("password is wrong")
    }
    const token = await jwt.sign({ _id: data._id }, 'ABHIJIM@123')
    res.cookie("token", token)
    return  res.status(200).json({
       user: data,   
     token: token, 
});


})

userAuth.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })
    res.send("userlogged out")
})

userAuth.get("/me",authentication,async(req,res)=>{
    try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).send("Unable to fetch user");
  }
});


module.exports = userAuth