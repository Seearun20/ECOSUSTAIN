require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Product model
const Product = require('./models/Product');

const app = express();

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ... rest of your app.js code remains unchanged ...

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes to serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/Admin.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/product.html'));
});

// API: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// API: Add new product
app.post('/api/products', async (req, res) => {
  console.log('POST /api/products called with:', req.body);
  try {
    const { name, productCode, category } = req.body;

    if (!name || !productCode || !category) {
      return res.status(400).json({ error: 'Name, productCode, and category are required.' });
    }

    const product = new Product(req.body);
    const saved = await product.save();
    console.log('✅ Product saved:', saved);
    res.json(saved);
  } catch (err) {
    console.error('❌ Error saving product:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Product code must be unique.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// API: Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// API: Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get product by productCode
app.get('/api/products/code/:code', async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.code });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});