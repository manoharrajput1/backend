const jwt = require('jsonwebtoken');
const User = require('../models/schema');

const Authenticate = async(req, res, next)=>{
    try {
        const token = req.cookies.jwtoken
        // console.log(token);
        if(token){
        const verifyToken =  jwt.verify(token, 'thisisthesecretkeyofthisprogram');
        const rootUser = await User.findOne({_id:verifyToken._id, 'tokens.token':token});
        // console.log(rootUser);
        if(!rootUser){throw new Error('user not found')}
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;    
        next()
        }else{
            res.json('not logged in')
        }       
    } catch (err) {
        res.status(401).send('unauthorised')
        console.log(err);
    }
}
module.exports = Authenticate;