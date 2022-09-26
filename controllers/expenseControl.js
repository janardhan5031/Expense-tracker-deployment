const expenses = require('../models/Expences');
const AWS = require('aws-sdk');

exports.add = (req,res,next) =>{
    const event = req.body.event;
    const price = Number(req.body.price);
    const Income = req.body.Income;
    const Expense = req.body.Expense;
    req.user.createExpense({event,price,Income,Expense})
    .then(()=>{
        if(Expense){
            return req.user.update({TotalExpense:req.user.TotalExpense+price})
        }else{
            return  req.user.update({TotalIncome:req.user.TotalIncome+price})
        }
    })
    .then(result =>{
        console.log(result);
        res.status(201).json({success:true,msg:'sucessfully expense added'})
    })
    .catch(err =>{
        res.json({sucess:false,msg:'unable to add expense', error:er})
    })
}

// expenses with pagination
exports.getAll = (req,res,next) =>{
    const page = Number(req.query.page);
    //console.log(page)

    req.user.getExpenses({where:{Expense:true}})
    // limit 2 expenses per page
    .then(expenses =>{
        const total_exp = expenses.length;
        //console.log(expenses.length)
        const start = page*2;
        const end = total_exp>= start+2 ? start+2 : total_exp;

        const prev = page ===0? false :true;
        const next = end>= total_exp ? false: true;
        
        const array = expenses.slice(start,end);
        //console.log(array);
        
        res.json({data:array,next:next,prev:prev});
    })
    .catch(err => console.log(err));
}

exports.getAllExpenses =(req,res,next) =>{
    try{
        req.user.getExpenses()
        .then(expenses =>{
            //console.log(expenses);
            res.send(expenses);
        })
        .catch(err => confirm.log(err));
    }
    catch(err){
        console.log(err);
    }
    
}

exports.deleteExpense = (req,res,next)=>{
    req.user.getExpenses({where:{id:req.body.id}})
    .then(expense=>{
        const price = expense[0].price;

        req.user.update({expense:req.user.TotalExpense-price})
        .then(result =>{
            return expense[0].destroy();
        })
        .catch(err => console.log(err));
    })
    .then(result =>{
        res.json(result);
    })
    .catch(err =>console.log(err))
}

function uploadToS3(data,filename){
    try{
        // create a new instance of s3 access through IAM credentials
        let s3bucket =new AWS.S3({
            accessKeyId:process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_SECRETE_ACCESS_KEY,
            Bucket:process.env.BUCKET_NAME
        })
        // basically creating a bucket is leads to a network call it might be take some time to complete
        // js is not wait for result because of asynchronus nature to over come this use promise
        return new Promise((resolve,reject)=>{
            s3bucket.createBucket(()=>{
                var params = {
                    Bucket:process.env.BUCKET_NAME,
                    Key:filename,
                    Body:data,
                    /* to make file publically accessble to read onlu through access control level */
                    ACL:'public-read'
                }
                s3bucket.upload(params,(err,success)=>{
                    if(err){
                        // if any error, reject function will be taken
                        reject(err)
                    }else{
                        //if success, resolve funcion will be taken
                        console.log(success)
                        resolve(success)
                    }
                })
            })
        }) 
        
    }catch(err){
        res.json({msg:'something went wrong'});
    }
    
    
}


exports.downloadExpenses = async (req,res,next) =>{
    try{
        const AllExpenses = await req.user.getExpenses();  
        // stringify the all expenses and store it in a .txt file
        const stringifiedExpenses = JSON.stringify(AllExpenses);

        // create a new file name every time user clicks download btn to avoid over writening the files
        // make sure that -> / creates a folder formate
        const fileName = `Expense${req.user.id}/${new Date}.txt`;

        // get the file url after the uploading the data into file that gives url as response
        // keep wait the function to get resolve the promise and return the data
        const successResult = await uploadToS3(stringifiedExpenses,fileName);
        //console.log(url)
        // saving the file urls in database
        await req.user.createFile({fileName:successResult.key,url:successResult.Location})

        res.status(200).json({url:successResult.Location,status:'success'});
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:'somtheing went wrong' ,error:err})
    }
    
     
}