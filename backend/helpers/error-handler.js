function errorHandler(err, req,res,next){

    if(err.name == 'UnauthorizedError'){
        //authentication error
    return res.status(401).json({message: "The user is not authorized"});
    }
    if(err.name == 'ValdiationError'){
        //validation error
    return res.status(401).json({message: err});
    }
    // general errors
    return res.status(500).json({message:err});
}

module.exports = errorHandler;