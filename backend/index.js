// backend/index.js
require('dotenv').config();
const express = require('express');
const auditRouter = require('./routes/audit');
const reportRouter = require('./routes/report');
const reportPngRouter = require('./routes/reportPng');
const checkoutRouter = require('./routes/checkout');
const webhookRouter = require('./routes/webhook');

const app = express();
const port = process.env.PORT || 3001;

// 1️⃣ Mount webhook route with raw body parser BEFORE any JSON middleware
app.use(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

// 2️⃣ JSON parser for all other API routes
app.use(express.json());
app.use('/api/audit', auditRouter);
app.use('/api/report', reportRouter);
app.use('/api/report/png', reportPngRouter);
app.use('/api/checkout', checkoutRouter);

app.listen(port, () => {
  console.log(`AuditIQ backend listening on port ${port}`);
});