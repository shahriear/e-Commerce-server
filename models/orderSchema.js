const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedVariants: [
    {
      variantType: String, // e.g., 'color', 'size'
      option: String, // e.g., 'Red', 'M'
    },
  ],
  price: {
    type: Number, // calculated based on base price + additionalPrice from variants
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default:"pending",
    },
    paymentResult: {
      id: { type: String },
      status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'complete'],
      },
      update_time: { type: String },
    },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);
