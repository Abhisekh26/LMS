
const express= require("express")
const connectdb = require("./database/config")
var cookieParser = require("cookie-parser")
const app = express()

const userAuth = require("./router/userAuth")
const courseAuth = require("./router/courseAuth")
const studentAuth = require("./router/studentAuth")
app.use(express.json())
app.use(cookieParser())
app.use("/",userAuth)
app.use("/",courseAuth)
app.use("/",studentAuth)
connectdb().then(() => {
    console.log("connection established")
    app.listen(5500, () => {
        console.log("server has started")
    })
}).catch((err) => {
    console.log("error happened")
})