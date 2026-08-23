
const express= require('express');
const user = require('../models/user');
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require('../utils/WrapAsync.js');
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware.js');
//sign-up page
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
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){

      return next(err);
       
    }
      req.flash("success","Welcome To wandurlust!")
      res.redirect("/listings");

   })
} catch(err){
    
    req.flash("error",err.message);
    res.redirect("/signup");


}}));
 
//login page

router.get("/login",(req,res)=>{


     res.render("users/login.ejs");



});

router.post("/login",saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
(req,res)=>{
  req.flash("success","Welcome back to Wanderlust! You are logged in! ");
  let redirectUrl=res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);

})


//logout

router.get("/logout",(req,res)=>{
req.logOut((err)=>{
  if (err){

    return next(err);
  }
  req.flash("success","you  are logged out!");
  res.redirect("/listings");

})


})





module.exports=router;