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
  inStock: { 
    type: Boolean, 
    default: true,
    set: function() {
      // This setter ensures inStock is always based on variants availability
      if (!this.variants || this.variants.length === 0) {
        return false;
      }
      
      // Check if any variant has available values
      return this.variants.some(variant => 
        variant.values && variant.values.some(value => value.available !== false)
      );
    }
  },
  variants: [VariantSchema],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to update inStock status before saving
ProductSchema.pre('save', function(next) {
  // If no variants, mark as out of stock
  if (!this.variants || this.variants.length === 0) {
    this.inStock = false;
    return next();
  }
  
  // Check if any variant has available values
  const hasAvailableVariants = this.variants.some(variant => 
    variant.values && variant.values.some(value => value.available !== false)
  );
  
  this.inStock = hasAvailableVariants;
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
