//we are using joi, server-side schema validation for error handling

const Joi = require('joi');
const review = require('./models/review');



 module.exports.listingSchema=Joi.object({

        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),//min starts from 0 for avoiding negative number
          image:Joi.string().allow("",null),
          
 
}).required();



//module.exports.reviewSchema=Joi.object({
//
    // rating:Joi.number().required().min(1).max(5),
     //comment:Joi.string().required()
// i changed this because of rating error in show ejs i have written like review[rating]. u can change there or here . so i change joi by adding the tahe nested review.
 

//}).required()
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required() 
});