require('dotenv').config();
const express = require('express');
const cors = require('cors');

const auditRouter      = require('./routes/audit');
const reportRouter     = require('./routes/report');
const reportPngRouter  = require('./routes/reportPng');
const checkoutRouter   = require('./routes/checkout');
const historyRouter    = require('./routes/history');
const webhookRouter    = require('./routes/webhook');

const app = express();
const port = process.env.PORT || 3001;

// 1️⃣ CORS — allow your front-end origin to talk to us
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 2️⃣ Health check
app.get('/', (req, res) => {
  res.send('AuditIQ backend is up and running');
});

// 3️⃣ Stripe webhooks need raw JSON
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

// 4️⃣ All other routes speak JSON
app.use(express.json());
app.use('/api/audit', auditRouter);
app.use('/api/report', reportRouter);
app.use('/api/report/png', reportPngRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/history', historyRouter);

// 5️⃣ Start!
app.listen(port, () => {
  console.log(`🔊 AuditIQ backend listening on port ${port}`);
});
