
const express= require("express")
const connectdb = require("./database/config")
var cookieParser = require("cookie-parser")
const app = express()

const userAuth = require("./router/userAuth")
const courseAuth = require("./router/courseAuth")
app.use(express.json())
app.use(cookieParser())
app.use("/",userAuth)
app.use("/",courseAuth)
connectdb().then(() => {
    console.log("connection established")
    app.listen(5500, () => {
        console.log("server has started")
    })
}).catch((err) => {
    console.log("error happened")
})