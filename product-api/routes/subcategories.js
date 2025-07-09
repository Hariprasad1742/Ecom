const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const Brand = require('../models/Brand');

// Create subcategory
router.post('/', async (req, res) => {
  try {
    const subcategory = new SubCategory(req.body);
    const saved = await subcategory.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single subcategory by ID
router.get('/:id', async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subcategory) return res.status(404).json({ error: 'SubCategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all subcategories with category 
router.get('/', async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Create brand under a subcategory
router.post('/:subCategoryId/brands', async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      subCategory: req.params.subCategoryId,
    });
    const saved = await brand.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔍 Get brands under a subcategory
router.get('/:subCategoryId/brands', async (req, res) => {
  try {
    const brands = await Brand.find({ subCategory: req.params.subCategoryId });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
