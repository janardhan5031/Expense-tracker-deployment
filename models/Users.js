const sequelize = require('sequelize');

const Sequelize = require('../util/database');

const Users = Sequelize.define('Users',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:sequelize.STRING,
    },
    mail:{
        type:sequelize.STRING,
        unique:true
    },
    number:sequelize.INTEGER,
    password:sequelize.STRING,
    isPremiumUser:sequelize.BOOLEAN,
    TotalIncome:sequelize.INTEGER,
    TotalExpense:sequelize.INTEGER
})

module.exports =Users;