
const express= require('express');
const user = require('../models/user');
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require('../utils/WrapAsync.js');


router.get("/signup",(req,res)=>{
res.render("users/signup.ejs");

})


router.post("/signup",WrapAsync(async(req,res)=>{

  try{
    let {username,email,password}=req.body;
    const newUser= new User(
        {
            username:username,
            email:email,
        }
    );

   const registeredUser= await User.register(newUser,password);
   req.flash("success","Welcome To wandurlust!")
   res.redirect("/listings");
   console.log("registerdUser");
} catch(err){
    
    req.flash("error",err.message);
    res.redirect("/signup");


}}));
module.exports=router;