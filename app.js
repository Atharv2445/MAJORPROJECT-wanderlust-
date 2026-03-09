//make the code clean and readable
const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
let methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

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
 app.get("/listings",async (req,res)=>{
   const allListings= await listing.find({});
   res.render("index.ejs",{allListings});


});

//show in detail

app.get("/listing/:id" ,async(req,res)=>{
    let {id}=req.params;
   const listingDetail= await listing.findById(id);
   res.render("show.ejs",{listingDetail});
   console.log(listingDetail);


});

//create new listings
app.get("/listings/new" ,(req,res)=>{

    res.render("new.ejs");

});

app.post("/listings",async(req,res)=>{

    let {title,description,image,price,location,country}=req.body;

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
});


//edit

app.get("/listings/:id/edit",async(req,res)=>{

    let {id}=req.params;
    const listingDetail= await listing.findById(id);
    res.render("edit.ejs",{listingDetail});



});

app.patch("/listings/:id",async(req,res)=>{
    
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

    res.redirect(`/listing/${id}`);


});

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;

    let deleted=await listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})