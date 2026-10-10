const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  // discount: {
  //   type: Number, // Discount percentage (e.g., 10 for 10%)
  //   default: 0
  // },
  // discountedPrice: {
  //   type: Number,
  //   default: function() {
  //     return this.price - (this.price * (this.discount / 100));
  //   }
  // },
  stock: {
    type: Number,
    required: true
  },
  images: [{
    data: Buffer,
    contentType: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  feedback: [
    {
      user: String, // User's name or ID
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ]
});

// productSchema.pre('save', function(next) {
//   this.discountedPrice = this.price - (this.price * (this.discount / 100));
//   next();
// });

module.exports = mongoose.model('Product', productSchema);
