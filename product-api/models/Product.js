const mongoose = require('mongoose');

const VariantValueSchema = new mongoose.Schema({
  value: { type: String, required: true },
  available: { type: Boolean, default: true }
});

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [VariantValueSchema]
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand' 
  },
  price: { type: Number, required: true },
  description: String,
  inStock: { type: Boolean, default: true },
  variants: [VariantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
