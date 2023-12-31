const Jwt = require('jsonwebtoken');

const authorization = (lowest)=> {

    const roles = ["GUEST","USER","ADMIN"];

    return (req,res, next) => {
        if (lowest === "GUEST"){
            next();
        }else {

            if (req.headers.authorization){
                let token = req.headers.authorization.substring(7);
                token = Jwt.decode(token)

                if (token.exp <= Date.now() /1000) {
                    res.status(403).json({message : "Token Expired"})
                }else {

                    if (roles.indexOf(lowest)<= roles.indexOf(token.user.role)){
                        next();
                    }else {

                        res.status(403).json({message: "You Have No Permission"})

                    }

                }

            } else {
                res.status(403).json({message: "No Token Sent"})
            }
        }
    }
}


module.exports = authorization;