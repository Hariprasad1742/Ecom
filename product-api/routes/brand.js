const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

router.post('/subcategories/:subCategoryId/brands', async (req, res) => {
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

router.get('/subcategories/:subCategoryId/brands', async (req, res) => {
  try {
    const brands = await Brand.find({ subCategory: req.params.subCategoryId });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/brands/:id', async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/brands/:id', async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/brands
router.post('/', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const saved = await brand.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
