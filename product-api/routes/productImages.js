const express = require('express');
const router = express.Router();
const ProductImage = require('../models/ProductImage');

router.post('/:productId/images', async (req, res) => {
  try {
    const image = new ProductImage({
      ...req.body,
      product_id: req.params.productId
    });
    const saved = await image.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:productId/images', async (req, res) => {
  try {
    const images = await ProductImage.find({ product_id: req.params.productId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
