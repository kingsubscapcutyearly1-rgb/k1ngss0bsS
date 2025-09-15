const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: `/uploads/${req.file.filename}`
  });
});

// Products API endpoints
let products = [
  {
    id: 1,
    name: 'Premium Digital Tool',
    price: 29.99,
    description: 'High-quality digital tool for professionals',
    category: 'Tools',
    image: '/images/product1.jpg'
  },
  {
    id: 2,
    name: 'Advanced Software Suite',
    price: 49.99,
    description: 'Complete software solution for businesses',
    category: 'Software',
    image: '/images/product2.jpg'
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Analytics endpoints
app.get('/api/analytics/dashboard', (req, res) => {
  const analytics = {
    totalSales: 15420,
    totalOrders: 342,
    totalCustomers: 1250,
    conversionRate: 3.2,
    salesData: [
      { month: 'Jan', sales: 1200 },
      { month: 'Feb', sales: 1800 },
      { month: 'Mar', sales: 1600 },
      { month: 'Apr', sales: 2200 },
      { month: 'May', sales: 2800 },
      { month: 'Jun', sales: 3200 }
    ]
  };
  res.json(analytics);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;