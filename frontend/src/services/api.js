// frontend/src/services/api.js

import axios from 'axios';

/**
 * Run a Lighthouse audit for the given URL.
 * @param {string} url
 * @returns {Promise} Axios response with JSON { categories, tips }
 */
export function audit(url) {
  return axios.post('/api/audit', { url });
}

/**
 * Download a PDF audit report for the given URL.
 * @param {string} url
 * @returns {Promise<Blob>} Axios response blob containing the PDF
 */
export function downloadReport(url) {
  return axios.post(
    '/api/report',
    { url },
    { responseType: 'blob' }
  );
}

/**
 * Download a PNG audit report for the given URL.
 * @param {string} url
 * @returns {Promise<Blob>} Axios response blob containing the PNG
 */
export function downloadPng(url) {
  return axios.post(
    '/api/report/png',
    { url },
    { responseType: 'blob' }
  );
}

/**
 * Create a Stripe checkout session for a one-off purchase ($25/report)
 */
export function createPurchaseSession(quantity = 1) {
  return axios.post('/api/checkout/purchase', { quantity });
}

/**
 * Create a Stripe checkout session for a subscription ($49/month)
 */
export function createSubscriptionSession() {
  return axios.post('/api/checkout/subscribe');
}