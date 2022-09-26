const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const files = require('../controllers/userFiles');

router.get('/getAllFiles',auth.userAuthentication,files.getAllUserFiles);

router.get(`/getOneFile/:id`,auth.userAuthentication,files.getSingleFile);


module.exports = router;

