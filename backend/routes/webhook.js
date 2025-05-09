// backend/routes/webhook.js
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { addSession } = require('../utils/store');
const router = express.Router();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // req.body is the raw Buffer here
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const sess = event.data.object;
      console.log('✅ Checkout completed:', sess.id);
      addSession({
        sessionId: sess.id,
        customer: sess.customer_email || sess.customer,
        url: sess.metadata.url,
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case 'invoice.paid': {
      console.log('✅ Subscription invoice paid');
      break;
    }
    case 'invoice.payment_failed': {
      console.log('❌ Subscription payment failed');
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
});

module.exports = router;
