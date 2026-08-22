//make the code clean and readable

//main page

const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");

const path=require("path");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
let methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const ExpressError=require("./utils/ExpressError.js");
app.use(express.json()); 
const flash=require("connect-flash");//flash messages.
const session = require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const sessionOptions=session(
  {
  secret:"biggest secret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true, 
  },

  },

)

app.use(sessionOptions);
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/demoUser",async(req,res)=>{

  let fakeUser= new User({
   email:"pappu@gmail.com",
   username:"pappu_lodu",


  });

  let registerdUser=await User.register(fakeUser,"congress@123");//congress is password.
  res.send(registerdUser);



});





app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

    






async function main(){

    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}

main().then(()=>{
  console.log("connected to db");

}).catch((err)=>{
   console.log(err)
})

app.listen(port,()=>{

    console.log("server is runing on port 8080");
});

app.get("/",(req,res)=>{


    res.send("working good");

});

// app.get("/listing",async(req,res)=>{

//     let sampleListing=new listing({
//          title:"my home",
//          description:"by the beach",
//          image:"",
//          price:2999,
//          location:"goa",
//          country:"india"


//     });

//     await sampleListing.save();



//     res.send("working..");

// });



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);






//Error handler for server-side



        // app.use("listings",(err,req,res,next)=>{

        // throw new ExpressError(404,"you enter wrong value");
        // next(err);
        


        // });
// app.use((err,req,res,next)=>{

//      throw new ExpressError(404,"page not found");
//      next(err);
     

// });


app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
    


});
app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something Went Wrong!!"}=err;
   // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{ err});
    


});