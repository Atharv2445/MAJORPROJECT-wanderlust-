
const express= require('express');
const router=express.Router();
const wrapAsync = require('../utils/WrapAsync');
const listing=require("../models/listing.js");
const { listingSchema , reviewSchema } = require("../schema.js"); 
const ExpressError=require("../utils/ExpressError.js");



//validate using joi
const valdiateListing=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=listingSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}





//allListings
 router.get("/",wrapAsync(async (req,res)=>{
   const allListings= await listing.find({});
   res.render("index.ejs",{allListings});


}));

//create new listings
router.get("/new" ,(req,res)=>{

    res.render("new.ejs");

});

//show in detail

router.get("/:id" ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    
   const listingDetail= await listing.findById(id).populate("reviews");
     if(!listingDetail){
         req.flash("error","Listing is requested for does not exists!");//error flash-message if listing is deleted someone still try to access.
         return res.redirect("/listings");
    }
   res.render("show.ejs",{listingDetail});
   console.log(listingDetail);


}));



router.post("/",valdiateListing,wrapAsync(async(req,res)=>{//u can see here valdiateListing middleware that first valdiate and futher work will start.

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
    req.flash("success","New Listing Created!");
   


    res.redirect("/listings");
}));

//edit

router.get("/:id/edit",wrapAsync(async(req,res)=>{
    

    let {id}=req.params;
    const listingDetail= await listing.findById(id);
      if(!listingDetail){
         req.flash("error","Listing is requested for does not exists!");//error flash-message if listing is deleted someone still try to access.
         return res.redirect("/listings");
    }
    res.render("edit.ejs",{listingDetail});



}));

router.patch("/:id",valdiateListing,wrapAsync(async(req,res)=>{//u can see here valdiateListing middleware that first valdiate and futher work will start.
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

        req.flash("success","Listing Updated!");

    res.redirect(`/listings/${id}`);


}));

router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;

    let deleted=await listing.findByIdAndDelete(id);
    console.log(deleted);
     req.flash("success","Listing Deleted!");

    res.redirect("/listings");
}));


module.exports=router;
