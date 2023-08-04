const mongoose = require('mongoose')


const RegisterSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password: String
})


const RegisterModel = mongoose.model("reqister", RegisterSchema);
module.exports= RegisterModel;