const cors = require('cors');
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const serviceCategoryRoutes = require('./src/routes/serviceCategoryRoutes');
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  message: { success: false, message: 'Too many attempts, please try again later' },
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceCategoryRoutes);
app.use('/api/requests', serviceRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('ChoreAid backend is running');
});

module.exports = app;