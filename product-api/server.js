const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const categoryRoutes = require('./routes/categories');
const subCategoryRoutes = require('./routes/subcategories');
const productRoutes = require('./routes/products');

mongoose.connect('mongodb://127.0.0.1:27017/commercedb')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
