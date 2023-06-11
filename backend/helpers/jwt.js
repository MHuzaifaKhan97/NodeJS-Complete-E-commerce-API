const { expressjwt: jwt }  = require('express-jwt');

function authJwt(){
    const secret = process.env.SECRET
    const api = process.env.API_URL
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            { url: /\/api\/v1\/products(.*)/ ,methods:['GET','OPTIONS'],},
            { url: /\/api\/v1\/categories(.*)/ ,methods:['GET','OPTIONS'],},
            `${api}/user/login`,
            `${api}/user/register`,
        ]
    });
}

async function isRevoked(req, res){
    // if not admin
    if(res.payload.isAdmin){
       return true;
    }
       return false
}

module.exports = authJwt;