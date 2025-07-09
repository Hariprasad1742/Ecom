const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Brand = require('../models/Brand');

// 🔥 Create product under a brand
router.post('/brand/:brandId', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const product = new Product({
      ...req.body,
      brand: req.params.brandId,
      subCategory: brand.subCategory // auto-fill from brand
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 Create product (non-nested)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📤 Get all products with subCategory + category populated
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'subCategory',
        populate: { path: 'category' }
      })
      .populate('brand');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'subCategory',
        populate: { path: 'category' }
      })
      .populate('brand');
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// 🛠️ Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Get variants for a product
router.get('/:productId/variants', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.json(product?.variants || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add/update variants for a product
router.post('/:productId/variants', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      { variants: req.body.variants },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
