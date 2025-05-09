// backend/routes/checkout.js
require('dotenv').config();
const express = require('express');
// Initialize Stripe in one line to avoid an unused import
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const YOUR_DOMAIN = process.env.DOMAIN;

router.post('/purchase', async (req, res) => {
  const { quantity = 1 } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'AuditIQ Report ($25)' },
          unit_amount: 2500,
        },
        quantity,
      }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${YOUR_DOMAIN}/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe purchase error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: 'price_1ABCdefGhIjKlMnOp', // ← replace with your real Price ID
        quantity: 1,
      }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${YOUR_DOMAIN}/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe subscription error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
