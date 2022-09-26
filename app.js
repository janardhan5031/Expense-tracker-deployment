const path = require('path');
//const fs = require('fs');
//const https = require('https');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');           // importing .env module
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app =express(); 
app.use(cors());
dotenv.config();    // configuring the dot .enve before we use it


const user = require('./models/Users');
const expenses = require('./models/Expences');
const order = require('./models/orders');
const password = require('./models/passwords');
const file = require('./models/expenseFiles');



//app.use(helmet());  // using the this module before taking incoming requests

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

/*
const acccessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),  // directing the file stream in which file to save the data
    {flags:'a'}     // appending the incomeind data not over writing 
)
app.use(morgan('combined',{stream:acccessLogStream})) // sending the logs stream to save in file 
*/

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));

const database = require('./util/database');

const userRouters = require('./routes/UserRouters');
const expenesRouter = require('./routes/expenses');
const orderRoutes = require('./routes/purchases');
const passwordRouter = require('./routes/forgetPassword');
const files = require('./routes/userFiles');
const pages= require('./routes/sendPage');

app.use(userRouters);
app.use('/password',passwordRouter);
app.use('/purchase',orderRoutes);
app.use('/expenses',expenesRouter);
app.use('/files',files);

// serving js and css and html files to frontend
app.use('/public',(req,res,next)=>{

    const files= new Set([
        '/frontEnd/sign_up/signUp.css',
        '/frontEnd/sign_up/signUp.html',
        '/frontEnd/sign_up/signUp.js',
        '/frontEnd/sign_in/sign_in.html',
        '/frontEnd/sign_in/sign_in.css',
        '/frontEnd/sign_in/sign_in.js',
        '/resetPassword/forget.html',
        '/resetPassword/forget.css',
        '/resetPassword/forget.js',
        '/views/page_404.css'
    ]);

    const url= req.url;
    console.log(url);
    if(files.has(url)){
        res.sendFile(path.join(__dirname,`./public${req.url}`));
    }else{
        next();
    }
});

// sending 404 page if requst hit any of the deined paths 
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'./public/views/page_404.html'));
});

// associations
user.hasMany(expenses);     expenses.belongsTo(user);

user.hasMany(order);        order.belongsTo(user);

user.hasMany(password);     password.belongsTo(user);

user.hasMany(file);         file.belongsTo(user);

database.
sync()
//sync({force:true})
.then(result =>{

    /* https.createServer({
        key:privateKey,
        cert:certificate
    },app)
    .listen(3000)   */

    app.listen(4000);
    //console.log('app is listening');
})
.catch(err => console.log(err));