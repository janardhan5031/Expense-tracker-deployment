const express = require('express');

const router = express.Router();

const passwords = require('../controllers/passwords');

router.post('/forgetpassword',passwords.forgetpassword);

router.get('/resetpassword/:urlStr',passwords.getresetpassword);

router.post('/resetpassword/:urlStr',passwords.postresetpassword);

module.exports = router;