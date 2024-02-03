const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {

    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith('Bearer')){
        return res.status(404).json({"message": "User is not loged in"});
    }

    const token = authHeaders.split(' ')[1]
    console.log(JWT_SECRET);

    try{
        const decode = jwt.verify(token,JWT_SECRET);
        req.userId = decode.userId
        next();
    }
    catch{
        return res.status(404).send("Login");
    }
}

module.exports = authMiddleware;