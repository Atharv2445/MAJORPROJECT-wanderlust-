//make the code clean and readable

//main page

const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");

const path=require("path");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
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



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);






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