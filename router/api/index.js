const express = require('express');
const router = express.Router();
const authRoute = require('./auth');
const productRoute = require('./product');
router.use('/auth', authRoute);
router.use('/product', productRoute);

module.exports = router;
