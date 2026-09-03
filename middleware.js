const listing=require("./models/listing.js");




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