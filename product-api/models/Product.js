const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  name: String,       
  value: String         
}, { _id: true });       

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  price: { type: Number, required: true },
  description: String,
  inStock: { type: Boolean, default: true },
  variants: [VariantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
