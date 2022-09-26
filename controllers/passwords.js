
const path= require('path');

const User = require('../models/Users');
const passwords = require('../models/passwords');
const sgMail = require('@sendgrid/mail');   // library for sending forget password mail
const uuid = require('uuid');        // library for unique ids
const bcrypt = require('bcrypt');   // to encrypt the passwords



//forget password middleware
exports.forgetpassword = (req,res,next) =>{
    const email = req.body.email;
    let user;
    //console.log(email);
    
    User.findAll({where:{mail:email}})
    .then(users =>{
        if(users.length > 0){
            user=users[0];
            users[0].getPasswords({where:{active:true}})
            .then(urls=>{
                // if the user has active reset urls then send that url
                //console.log(urls[0].passwordURL)
                if(urls.length>0){
                    return res.json({
                        msg:'successfully sent mail to reset',
                        resetUrl:`http://localhost:4000/password/resetpassword/${urls[0].passwordURL}`
                    })
                }
                //else create new url for them to reset their password
                else{
                    const urlStr = uuid.v4();
                    console.log(user)
                    user.createPassword({passwordURL:urlStr,active:true})
                    .then(new_url =>{
                        return res.json({
                            msg:'successfully sent mail to reset',
                            resetUrl:`http://localhost:4000/password/resetpassword/${new_url.passwordURL}`
                        })
                    })
                    .catch(err =>res.json({msg:'unable to create new url',errot:err}));
                }
           })
           .catch(err =>res.json({msg:'somthing went wrong in url creation',error:err}));
        }else{
            res.json({msg:'user not found with this mail'})
        }
    })
    .catch(err=> res.json({msg:'unable to find user',error:err}))
   
};

exports.getresetpassword =(req,res,next)=>{
    const urlStr = req.params.urlStr;
    passwords.findAll({where:{passwordURL:urlStr}})
    .then((password_url)=>{
        if(password_url.length>0 && password_url[0].active){
            
            res.sendFile(path.join(__dirname,'../public/resetPassword/forget.html'))
        }else{
            res.status(404).json({msg:'this url is exipred'})
        }
    })
    .catch(err =>{
        res.sendFile(path.join(__dirname,'../public/views/page_404.html'))
    })
}

exports.postresetpassword = (req,res,next) =>{
    const urlStr = req.params.urlStr;
    let password_URL;
    passwords.findAll({where:{passwordURL:urlStr}})
    .then(password_url =>{
        password_URL=password_url[0].passwordURL;
        const userid = password_url[0].UserId;
        const password = req.body.new_password;
        console.log('======', password)
        // hash the given password with salting
        bcrypt.genSalt(10, ((err,salt_string) =>{
            if(err){
                return res.json({error:err,msg:'unable to add salting'});
            }
            bcrypt.hash(password,salt_string,((err,hashed_str) =>{
                if(err){
                   return res.json({msg:'unable hash the password'});
                }
                //console.log(hashed_str);
                User.update({ password:hashed_str },{where:{id:userid}})
                .then(() =>{
                    passwords.update({active:false},{where:{passwordURL:password_URL}})
                    .then(result =>{
                        return res.json({msg:'successfully updated password',
                        url:'http://localhost:4000/public/frontEnd/sign_in/sign_in.html'
                        })
                    })
                    .catch(err =>res.json({msg:"unable to de-activate reset url"}));
                })
                .catch(err=>{
                    return res.json({error:err,msg:'unable to update password'})
                })
            }))
        }))

    })
    .catch(err => console.log(err));
}

