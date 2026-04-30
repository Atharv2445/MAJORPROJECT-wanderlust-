class ExpressError extends Error{

    constructor(status,message){

        super();
        this.statusCode=this.statusCode;
        this.message=message;

    }



}

module.exports=ExpressError;