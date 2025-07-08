const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

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

module.exports = router;
