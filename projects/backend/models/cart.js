// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    deliveryInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
