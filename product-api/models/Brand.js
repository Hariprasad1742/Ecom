const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true 
  },
  description: String,
  logo: String,
  website: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', BrandSchema);
