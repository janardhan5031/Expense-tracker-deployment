const files = require('../models/expenseFiles');

exports.getAllUserFiles =(req,res,next) =>{
    req.user.getFiles({attributes:['id','fileName']})
    .then(data=>{    
        res.send(data);
    })
    .catch(err => {
        console.log(err)
        res.json({msg:'unable to get files', error:err});
    });
}   

exports.getSingleFile =(req,res,next) =>{
    try{const id = req.params.id;
        req.user.getFiles({where:{id:id}})  
        .then(result =>{
            console.log(result)
            res.status(200).json({url:result[0].url})
        })
        .catch(err => console.log(err))
    }catch(err){
        console.log(err);
    }
}