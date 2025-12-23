const mongoose= require("mongoose")
const connectdb=async()=>{
await mongoose.connect("mongodb+srv://gmerockford_db_user:hHa7nW0S49Q6HJVe@learningexpress.qdjztw5.mongodb.net/lms")
}

 
module.exports= connectdb