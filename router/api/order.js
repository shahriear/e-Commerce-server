const express = require('express');
const { addNewOrder, updateOrder, paymentIntent } = require('../../controllers/orderControllers');
const authMiddleware = require('../../middleware/authMiddleware');
const RoleCheck = require('../../middleware/roleMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, addNewOrder);
// router.post('/payment-intent', paymentIntent);
router.post(
  '/updatestatus/:orderId',
  authMiddleware,
  RoleCheck(['admin', 'stuff']),
  updateOrder,
);
module.exports = router;