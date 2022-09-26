const express = require('express');
const router = express.Router();



router.get('/public',(req,res,next)=>{

    const files= new Set([
        '/frontEnd/sign_up/signUp.css',
        '/frontEnd/sign_up/signUp.html',
        '/frontEnd/sign_up/signUp.js',
        '/frontEnd/sign_in/sign_in.html',
        '/frontEnd/sign_in/sign_in.css',
        '/frontEnd/sign_in/sign_in.js',
        '/resetPassword/forget.html',
        '/resetPassword/forget.css',
        '/resetPassword/forget.js'
    ]);

    console.log('=====jani')
    const url= req.url;
    console.log(url);
    if(files.has(url)){
        res.sendFile(path.join(__dirname,`./public${req.url}`));
    }else{
        next();
    }
})


module.exports = router;