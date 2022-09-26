
const jwt = require('jsonwebtoken');
const Users = require('../models/Users')

exports.userAuthentication = (req,res,next) =>{
    //console.log('jani');
    const token = req.header('Authorization');
    const userId = Number(jwt.verify(token,process.env.SECRETE_KEY));

    Users.findByPk(userId)
    .then(user =>{
        req.user=user;  // this req or res is for this user user only
        next();     // states go next process
    })
    .catch(err => {
        return res.json({success:false, msg:'user is not authorized',error:err})
    });
}