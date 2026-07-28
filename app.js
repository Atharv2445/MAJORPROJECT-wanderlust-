//make the code clean and readable

//main page

const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const review=require("./models/review.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
let methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const wrapAsync = require('./utils/WrapAsync');
const ExpressError=require("./utils/ExpressError.js");
app.use(express.json()); 
const { listingSchema , reviewSchema } = require("./schema.js"); 




//validate using joi
const valdiateListing=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=listingSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}

const valdiateReview=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=reviewSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}



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

//allListings
 app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings= await listing.find({});
   res.render("index.ejs",{allListings});


}));

//show in detail

app.get("/listings/:id" ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   const listingDetail= await listing.findById(id).populate("reviews");
   res.render("show.ejs",{listingDetail});
   console.log(listingDetail);


}));

//create new listings
app.get("/listing/new" ,(req,res)=>{

    res.render("new.ejs");

});

app.post("/listings",valdiateListing,wrapAsync(async(req,res)=>{//u can see here valdiateListing middleware that first valdiate and futher work will start.

    // if(!req.body.listing){

    //     throw new ExpressError(400,"send a valid data for listings");//handling errors on server side like from hoppscotch when we directly dealing with the serverside.
    //     //basically i'm throwing my custome error.
    // }
    //but we have used joi for handling server-side error.because every time throwing errors make code bulkey.

   
    
    let {title,description,image,price,location,country}=req.body;
    const result=listingSchema.validate(req.body);
    console.log(result);

    const newListing=new listing({

        title:title,
          description:description,
          image:image,
          price:price,
          location:location,
          country:country,


    });

    await newListing.save();


    res.redirect("/listings");
}));

//edit

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    

    let {id}=req.params;
    const listingDetail= await listing.findById(id);
    res.render("edit.ejs",{listingDetail});



}));

app.patch("/listings/:id",valdiateListing,wrapAsync(async(req,res)=>{//u can see here valdiateListing middleware that first valdiate and futher work will start.
    // if(!req.body.listing){

    //     throw new ExpressError(400,"send a valid data for listings");//handling errors on server side like from hoppscotch when we directly dealing with the serverside.
    //     //basically i'm throwing my custome error.
     //but we have used joi for handling server-side error.because every time throwing errors make code bulkey.

    
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    const updated=await listing.findByIdAndUpdate(id,{

        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,

    } );

    res.redirect(`/listings/${id}`);


}));

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;

    let deleted=await listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
}));



//review form submition

app.post("/listings/:id/reviews",valdiateReview ,wrapAsync( async(req,res)=>{
   let { id } = req.params;
    let targetListing = await listing.findById(id);
    const newReview = new review(req.body.review); 
     targetListing.reviews.push(newReview);

    await newReview.save();
    await targetListing.save();
   
    res.redirect(`/listings/${id}`);

    

}));

//review delete

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{

    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
                 
                
}));









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


