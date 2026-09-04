const express= require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/WrapAsync');
const listing=require("../models/listing.js");
const review=require("../models/review.js");

const { validateReview }=require("../middleware.js");







//review form submition

router.post("/",validateReview ,wrapAsync( async(req,res)=>{
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