const express = require('express');
const { addNewOrder } = require('../../controllers/orderControllers');
const authMiddleware = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, addNewOrder);
module.exports = router;