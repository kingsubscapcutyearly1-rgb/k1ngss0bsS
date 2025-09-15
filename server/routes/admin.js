const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const router = express.Router();

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const db = req.app.locals.db;
    
    const adminSetting = await db.get(
      'SELECT setting_value FROM admin_settings WHERE setting_key = ?',
      ['admin_password']
    );

    if (!adminSetting) {
      return res.status(401).json({ error: 'Admin not configured' });
    }

    const isValidPassword = await bcrypt.compare(password, adminSetting.setting_value);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products (admin view)
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const productModel = new Product(db);
    const products = await productModel.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const productModel = new Product(db);
    const product = await productModel.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const productModel = new Product(db);
    const product = await productModel.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const productModel = new Product(db);
    await productModel.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin settings
router.get('/settings', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const settings = await db.all('SELECT * FROM admin_settings');
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin settings
router.post('/settings', verifyAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await db.run(
        `INSERT OR REPLACE INTO admin_settings (setting_key, setting_value, updated_at) 
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, value]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;