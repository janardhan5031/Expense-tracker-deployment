const sequelize = require('sequelize');
const database = require('../util/database');

const files = database.define('files',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    fileName:sequelize.STRING,
    url:sequelize.STRING
})

module.exports = files;