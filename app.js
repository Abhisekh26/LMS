
const express= require("express")
const connectdb = require("./database/config")
const app = express()

const userAuth = require("./router/userAuth")
app.use(express.json())

app.use("/",userAuth)
connectdb().then(() => {
    console.log("connection established")
    app.listen(5500, () => {
        console.log("server has started")
    })
}).catch((err) => {
    console.log("error happened")
})