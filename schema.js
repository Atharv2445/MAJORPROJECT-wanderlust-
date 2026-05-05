//we are using joi, server-side schema validation for error handling

const Joi = require('joi');



 module.exports.listingSchema=Joi.object({

        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),//min starts from 0 for avoiding negative number
          image:Joi.string().allow("",null),
          
 
}).required();