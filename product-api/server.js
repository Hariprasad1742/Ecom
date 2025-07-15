const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Route files
const categoryRoutes = require('./routes/categories');
const subCategoryRoutes = require('./routes/subcategories');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brand');
const imageRoutes = require('./routes/productImages');

mongoose.connect('mongodb://127.0.0.1:27017/commercedb')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/product-images', imageRoutes);
app.use(cors({ origin: 'http://localhost:5173' }));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
