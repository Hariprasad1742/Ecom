const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware to transform variant data for backward compatibility
const transformVariantData = (req, res, next) => {
  if (req.body.variants) {
    req.body.variants = req.body.variants.map(variant => {
      if (variant.values && Array.isArray(variant.values)) {
        // Check if values are strings (old format) and convert to objects
        variant.values = variant.values.map(value => {
          if (typeof value === 'string') {
            return { value: value, available: true };
          }
          return value; // Already in new format
        });
      }
      return variant;
    });
  }
  next();
};

// Create product
router.post('/', transformVariantData, async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    const populated = await Product.findById(saved._id)
      .populate('brand')
      .populate('subCategory');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('brand')
      .populate('subCategory');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand')
      .populate('subCategory');
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', transformVariantData, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('brand')
      .populate('subCategory');
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update variant value availability
router.patch('/:id/variants/:variantIndex/values/:valueIndex/availability', async (req, res) => {
  try {
    const { id, variantIndex, valueIndex } = req.params;
    const { available } = req.body;
    
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    if (!product.variants[variantIndex]) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    
    if (!product.variants[variantIndex].values[valueIndex]) {
      return res.status(404).json({ error: 'Variant value not found' });
    }
    
    product.variants[variantIndex].values[valueIndex].available = available;
    
    const updated = await product.save();
    const populated = await Product.findById(updated._id)
      .populate('brand')
      .populate('subCategory');
    
    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
