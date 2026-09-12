const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const { initDatabase } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const offerRoutes = require('./routes/offerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for submissions and login
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Static upload files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Root & Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'GS Vision API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server after DB init
async function bootstrap() {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`GS Vision Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    app.listen(config.port, () => {
      console.log(`GS Vision Server running with DB offline on port ${config.port}`);
    });
  }
}

if (require.main === module) {
  bootstrap();
} else {
  initDatabase().catch(err => console.error(err));
}

module.exports = app;
