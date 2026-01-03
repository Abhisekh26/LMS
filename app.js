
const express= require("express")
const connectdb = require("./database/config")
var cookieParser = require("cookie-parser")
const app = express()

const userAuth = require("./router/userAuth")
const courseAuth = require("./router/courseAuth")
const studentAuth = require("./router/studentAuth")
const lessonAuth = require("./router/lessonAuth")
const progressAuth = require("./router/progressAuth")
const cors = require("cors")
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


app.use("/",userAuth)
app.use("/",courseAuth)
app.use("/",studentAuth)
app.use("/",lessonAuth)
app.use("/",progressAuth)


connectdb().then(() => {
    console.log("connection established")
    app.listen(5500, () => {
        console.log("server has started")
    })
}).catch((err) => {
    console.log("error happened")
})