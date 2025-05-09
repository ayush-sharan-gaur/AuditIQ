// backend/routes/webhook.js
const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Construct the event using the raw body buffer
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle only the events we care about
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✅ Checkout completed:', event.data.object.id);
      break;
    case 'invoice.paid':
      console.log('✅ Subscription invoice paid');
      break;
    case 'invoice.payment_failed':
      console.log('❌ Subscription payment failed');
      break;
    default:
      // console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
