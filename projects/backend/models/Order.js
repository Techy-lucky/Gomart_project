// const mongoose = require('mongoose');
// const product = require('./product');

// const orderSchema = new mongoose.Schema({
//   products: [
//     {
//       name: String ,
//       productName: String,
//       price: Number,
//       quantity: Number,
//       image: String,
//     },
//   ],
//   deliveryInfo: {
//     fullName: String,
//     email: String,
//     address: String,
//     pincode: String,
//     city: String,
//     contact: String,
//   },
//   paymentInfo: {
//     mode: { type: String, enum: ['upi', 'cod'], required: true },
//     upiId: { type: String, required: function () { return this.mode === 'upi'; } },
//   },
//   totalAmount: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      name: String,
      productName: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  deliveryInfo: {
    fullName: String,
    email: String,
    address: String,
    pincode: String,
    city: String,
    contact: String,
  },
  paymentInfo: {
    mode: { type: String, enum: ['upi', 'cod'], required: true },
    upiId: { type: String, required: function () { return this.mode === 'upi'; } },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
