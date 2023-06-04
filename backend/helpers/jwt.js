const { expressjwt: jwt }  = require('express-jwt');

function authJwt(){
    const secret = process.env.SECRET
    return jwt({
        secret,
        algorithms: ['HS256']
    });
}

module.exports = authJwt;