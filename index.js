const express = require('express');
const { resolve } = require('path');
const User = require('./schema');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/Auth").then(console.log('Mongodb connected')).catch((e)=>console.log(e))

const app = express();
const port = 3010;

app.use(express.static('static'));



app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/register',async (res,req)=>{
  try{
    const {username,email,password}=req.body
    if(!username || !email || !password){
      return res.status(400).json({message:"All field are required"})
    }
   const salt = await bcrypt.genSalt(10)
   const hashPassword = await bcrypt .hash(password,salt)

   const newUser = new User({username,email,password:hashPassword})
   await newUser.save()
  res.status(201).json({message:"User created Successfully"})
  }
  catch(error){
   res.status(500).json({message:"Server error",error:error.message})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
