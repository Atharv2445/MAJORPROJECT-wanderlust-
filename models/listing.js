const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const listingSchema= new Schema({
  title:{
    type:String,
    required:true,

},
   description:String,
  image:{
      type: String,
     default:"https://plus.unsplash.com/premium_photo-1770738995215-a8582e5b1d97?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1770738995215-a8582e5b1d97?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,

  },
  price:Number,
  location:String,
  country:String,
});

const listing=mongoose.model("listing",listingSchema);

module.exports=listing;
