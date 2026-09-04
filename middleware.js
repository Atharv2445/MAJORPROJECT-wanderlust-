const listing=require("./models/listing.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");




module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
          req.session.redirectUrl=req.originalUrl;

          
        req.flash("error","you must be logged in to create listings!");
       return res.redirect("/login");
    }
    next();


}


module.exports.saveRedirectUrl=(req,res,next)=>{

    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();

}

//authorization, if he is not owner then he can't access.
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
  let listingDetail= await listing.findById(id);
 if(!listingDetail.owner.equals(res.locals.currUser._id)){ //authorization

            req.flash("error","You don't have permission to edit");
            return res.redirect(`/listings/${id}`);
         }

         next();
}

//validate using joi
module.exports.valdiateListing=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=listingSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}


//validate using joi
module.exports.validateReview=(req,res,next)=>{//we can write this also directly into create route.but here we created a miidleware.
    let {error}=reviewSchema.validate(req.body);
     if(error){
        throw new ExpressError(400,error.message);
     }else{
       next();
     }

}