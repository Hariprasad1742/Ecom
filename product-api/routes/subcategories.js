const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');

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

// Get all subcategories with category 
router.get('/', async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
