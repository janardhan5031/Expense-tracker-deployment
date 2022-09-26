const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/userControllers');
const authCtrl = require('../controllers/authController');

router.post('/signup',userCtrl.signupPage);

router.post(`/sign-in`,userCtrl.sign_in);

router.get('/get_user/:id',authCtrl.userAuthentication,userCtrl.getOne);

router.get('/getLeadership',authCtrl.userAuthentication,userCtrl.getAllUsersExpenses);

module.exports = router;
