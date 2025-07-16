const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// POST /api/brands/                     → Create a brand
router.post('/', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const saved = await brand.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/brands/                      → Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().populate('subCategory');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/brands/:id                   → Get single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('subCategory');
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/brands/:id                   → Update brand
router.put('/:id', async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/brands/:id                → Delete brand
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/brands/subcategories/:subCategoryId → Create brand under a subcategory
router.post('/subcategories/:subCategoryId', async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      subCategory: req.params.subCategoryId
    });
    const saved = await brand.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/brands/subcategories/:subCategoryId → Get all brands in a subcategory
router.get('/subcategories/:subCategoryId', async (req, res) => {
  try {
    const brands = await Brand.find({ subCategory: req.params.subCategoryId }).populate('subCategory');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
