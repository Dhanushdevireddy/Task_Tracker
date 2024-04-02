var jwt = require('jsonwebtoken');
secretKey = process.env.SECRET_KEY


const fetchuser = (req,res,next) =>{
    let token = req.header('Authorization')
    if(!token){
        res.status(401).send("Token is not sent")
    }
    try{
        let decodeddata=jwt.verify(token, secretKey);
        req.user=decodeddata.user
        next()
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }

}

module.exports = fetchuser