import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';

// Initialize SQLite database schema and seed data
initDatabase();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse JSON while preserving raw body for Razorpay webhook signature verification
app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// Global authentication parsing
app.use(authenticate);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aayusha Swad Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Handle 404 for unmatched /api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Serve production static frontend if dist folder exists (e.g. on Hostinger / Single-Port VPS)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for all frontend client-side routes (e.g. /checkout, /order-tracking, etc.)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n🍲 ========================================================`);
  console.log(`✨ Aayusha Swad Backend API running on http://localhost:${PORT}`);
  console.log(`🔒 OTP Auth, Database, Payments & Notifications Ready`);
  console.log(`🍲 ========================================================\n`);
});
