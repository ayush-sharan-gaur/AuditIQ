// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const auditRouter    = require('./routes/audit');
const reportRouter   = require('./routes/report');
const reportPngRouter= require('./routes/reportPng');
const checkoutRouter = require('./routes/checkout');
const webhookRouter  = require('./routes/webhook');
const historyRouter  = require('./routes/history');

const app = express();
const port = process.env.PORT || 3001;

// ❶ Allow your front-end origin (or all origins) to talk to this API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'    // in Render set CORS_ORIGIN=https://audit-iq.vercel.app
  })
);

// ❷ Mount your webhook route _before_ JSON parser
app.use(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

// ❸ JSON for everything else
app.use(express.json());
app.use('/api/audit',    auditRouter);
app.use('/api/report',   reportRouter);
app.use('/api/report/png', reportPngRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/history',  historyRouter);

app.listen(port, () => {
  console.log(`AuditIQ backend listening on port ${port}`);
});
