const jwt = require("jsonwebtoken")

const userAuthentication = async(req,res,next) => {
    const authHeaders = req.headers["authorization"]
    // console.log("authHeaders:",authHeaders)
    let jwtToken;
    if(authHeaders !== undefined){
         jwtToken = authHeaders.split(" ")[1]
        // console.log("token:",token)
        if(jwtToken === undefined){
            res.status(401).json({message:"Invalid JWT token"})
        }
        jwt.verify(jwtToken,`${process.env.MY_SECRET_KEY}`,async(error,payload)=>{
            if(error){
                // console.log("Error:","Error at verification")
                res.status(401).json({message:"Invalid JWT token"})
            }
            else{
                req.email = payload.email
                next();
            }
            
        })
    }
    
}

module.exports = userAuthentication;