const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  name: String,
  values: [String]   // Array of strings
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  price: { type: Number, required: true },
  description: String,
  inStock: { type: Boolean, default: true },
  variants: [VariantSchema],   // Variant with name + values array
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
