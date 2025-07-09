const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId, required: false },
  url: { type: String, required: true },
  alt_text: String,
  sort_order: Number,
  is_primary: { type: Boolean, default: false },
  image_type: { type: String, enum: ['main', 'gallery', 'thumbnail', 'zoom'], default: 'main' },
  file_size: Number,
  mime_type: String,
  width: Number,
  height: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductImage', ProductImageSchema);
