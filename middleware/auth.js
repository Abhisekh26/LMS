var jwt = require('jsonwebtoken');
const users = require("../models/user")

async function authentication(req, res, next) {
    try {
        const token = req.cookies.token
        console.log(token)
        const verifyToken = await jwt.verify(token, 'ABHIJIM@123')
        if (!verifyToken) {
            res.send("Log in again")
        }
        const user = await users.findById(verifyToken)
        if (!user) {
            res.send("login again")
        }
        else {
            req.user = user

        }
        next()
    }
    catch (err) {
        console.log("LOGIN ERROR 👉", err)
        res.status(400).send(err.message)
    }
}



module.exports = {
    authentication
}