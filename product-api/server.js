const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/commercedb')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== CATEGORY ROUTES =====

// Create category
app.post('/api/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SUBCATEGORY ROUTES =====

// Create subcategory
app.post('/api/subcategories', async (req, res) => {
  try {
    const subcategory = new SubCategory(req.body);
    const saved = await subcategory.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all subcategories with category populated
app.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== PRODUCT ROUTES =====

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products with subCategory and category
app.get('/api/products', async (req, res) => {
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

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
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

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SERVER START =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
