// frontend/src/services/api.js
import axios from 'axios';

/**
 * Create a single Axios instance that:
 *  • uses your custom REACT_APP_API_URL in production
 *  • falls back to a relative `/api` path in development
 */
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

/**
 * Run a Lighthouse audit for the given URL.
 * @param {string} url
 * @returns {Promise<{ categories: object, tips: string[] }>}
 */
export function audit(url) {
  return API.post('/api/audit', { url });
}

/**
 * Download a PDF audit report for the given URL.
 * @param {string} url
 * @returns {Promise<Blob>}
 */
export function downloadReport(url) {
  return API.post(
    '/api/report',
    { url },
    { responseType: 'blob' }
  );
}

/**
 * Download a PNG audit report for the given URL.
 * @param {string} url
 * @returns {Promise<Blob>}
 */
export function downloadPng(url) {
  return API.post(
    '/api/report/png',
    { url },
    { responseType: 'blob' }
  );
}

/**
 * Create a Stripe checkout session for a one-off purchase ($25/report).
 * @param {number} [quantity=1]
 * @returns {Promise<{ sessionId: string }>}
 */
export function createPurchaseSession(quantity = 1) {
  return API.post('/api/checkout/purchase', { quantity });
}

/**
 * Create a Stripe checkout session for a subscription ($49/month).
 * @returns {Promise<{ sessionId: string }>}
 */
export function createSubscriptionSession() {
  return API.post('/api/checkout/subscribe');
}
