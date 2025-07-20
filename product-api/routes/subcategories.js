const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const Brand = require('../models/Brand');

// ✅ Create a subcategory (simple route for admin dashboard)
router.post('/', async (req, res) => {
  try {
    const subcategory = new SubCategory(req.body);
    const saved = await subcategory.save();
    const populated = await SubCategory.findById(saved._id).populate('category');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Create a subcategory (nested route - keeping for backward compatibility)
router.post('/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const subcategory = new SubCategory({
      ...req.body,
      category: req.params.categoryId,
    });
    const saved = await subcategory.save();
    const populated = await SubCategory.findById(saved._id).populate('category');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all subcategories with populated category
router.get('/', async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single subcategory by ID with populated category
router.get('/:id', async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subcategory) return res.status(404).json({ error: 'SubCategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update subcategory
router.put('/:id', async (req, res) => {
  try {
    const updated = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'SubCategory not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete subcategory
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'SubCategory not found' });
    res.json({ message: 'SubCategory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Nested Brand Creation under a SubCategory
router.post('/:subCategoryId/brands', async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      subCategory: req.params.subCategoryId,
    });
    const saved = await brand.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔍 Get brands under a specific SubCategory
router.get('/:subCategoryId/brands', async (req, res) => {
  try {
    const brands = await Brand.find({ subCategory: req.params.subCategoryId });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
