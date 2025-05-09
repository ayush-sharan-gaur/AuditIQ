const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.DOMAIN;

// 1) One-off audit report purchase
router.post('/purchase', async (req, res) => {
  const { quantity = 1 } = req.body; // optional
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
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe purchase error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Subscription checkout (monthly $49)
router.post('/subscribe', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: 'price_1RMjlqR5p47nx8DGwxJrfY2v', // create this in Stripe Dashboard
        quantity: 1,
      }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe subscription error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;