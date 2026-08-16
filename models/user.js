const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{               //we don`t need to define username and password etc. because it it automatically done by passport mongoose.
        type:String,
        require:true,
    },
   
    
});
User.plugin(passportLocalMongoose.default);//it is automatically add the hashing salting features.

module.exports=mongoose.model("User",userSchema);