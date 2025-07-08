const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'subCategory',
        populate: { path: 'category' }
      });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'subCategory',
        populate: { path: 'category' }
      });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all variants for a product
router.get('/:productId/variants', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product.variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add variant to a product
router.post('/:productId/variants', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.variants.push(req.body);
    await product.save();
    res.status(201).json(product.variants);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a variant
router.put('/variants/:variantId', async (req, res) => {
  try {
    const product = await Product.findOne({ 'variants._id': req.params.variantId });
    if (!product) return res.status(404).json({ error: 'Variant not found' });

    const variant = product.variants.id(req.params.variantId);
    variant.set(req.body);
    await product.save();

    res.json(variant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a variant
router.delete('/variants/:variantId', async (req, res) => {
  try {
    const product = await Product.findOne({ 'variants._id': req.params.variantId });
    if (!product) return res.status(404).json({ error: 'Variant not found' });

    product.variants.id(req.params.variantId).remove();
    await product.save();

    res.json({ message: 'Variant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
