const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');
const bcrypt= require("bcrypt")
const jwt= require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express();
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST"],
    credentials:true
}));
app.use(express.json());
app.use (cookieParser())

mongoose.connect('mongodb+srv://ndefoago:Computer1234567890@management.ghxfhjh.mongodb.net/');

// token verifyUser
const verifyUser = (req, res , next) => {
  const token = req.cookies.token;
  if(!token) {
    return res.json ("The token was not availabe")
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) =>{
      if(err) return res.json("token is wrong")
      next();
    }) 
  }
}

app.get('/home',verifyUser,(req, res) =>{
  return res.json("success")

})

app.post("/login",(req, res)=>{
  const { email,  password } = req.body;
  RegisterModel.findOne({ email: email })
    .then(user => {
      if (user) { 
        bcrypt.compare(password,user.password,(err,response) => {
          if(response){
            const token = jwt.sign({email:user.email}, "jwt-secret-key", {expiresIn:"1d"})
            res.cookie("token", token);
            res.json("success")
          } else{
            res.json("the password is incorrect")
          }
        })
      } else{
            res.json("No record existed")
      }
    })  
})

app.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;
     bcrypt.hash(password,10)
     .then(hash =>{
          RegisterModel.create({  name, email,  phone, password: hash })
              .then(register=> res.json(register))
              .catch(err => res.json(err));
     }).catch(err => console.log(err.message))
        
      })


app.listen(3001, () => {
  console.log('Server is running');
});
