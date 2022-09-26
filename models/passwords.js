const sequelize = require('sequelize');
const database = require('../util/database');

const passwords = database.define('passwords',{
    id:{
        type:sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    passwordURL:sequelize.STRING,
    active:sequelize.BOOLEAN
});

module.exports=passwords;   