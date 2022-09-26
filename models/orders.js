
const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const orders = sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    orderId:Sequelize.STRING,
    paymentId:Sequelize.STRING,
    status:Sequelize.STRING
});

module.exports = orders;