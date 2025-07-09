const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Create category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 Get subcategories under a category
router.get('/:categoryId/subcategories', async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ category: req.params.categoryId });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
