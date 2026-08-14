const express= require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/WrapAsync');
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const review=require("../models/review.js");
const { listingSchema , reviewSchema } = require("../schema.js"); 









//validate using joi
const valdiateReview=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=reviewSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}
//review form submition

router.post("/",valdiateReview ,wrapAsync( async(req,res)=>{
   let { id } = req.params;
    let targetListing = await listing.findById(id);
    const newReview = new review(req.body.review); 
     targetListing.reviews.push(newReview);

    await newReview.save();
    await targetListing.save();
     req.flash("success","New Review Created!");

   
    res.redirect(`/listings/${id}`);

    

}));

//review delete

router.delete("/:reviewId",wrapAsync(async(req,res)=>{

    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await review.findByIdAndDelete(reviewId);
     req.flash("success"," Review Deleted!");

    res.redirect(`/listings/${id}`);
                 
                
}));

module.exports=router;