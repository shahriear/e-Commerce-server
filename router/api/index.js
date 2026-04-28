const express = require('express');
const router = express.Router();
const authRoute = require('./auth');
const productRoute = require('./product');
const orderRoute = require('./order');

router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/order', orderRoute);

module.exports = router;
