const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
