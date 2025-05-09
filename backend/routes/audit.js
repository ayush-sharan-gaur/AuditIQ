const express = require('express');
const { runLighthouse } = require('../utils/lighthouseService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  console.log('[audit] request for URL →', url);

  if (!url) {
    console.error('[audit] missing URL');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const report = await runLighthouse(url);
    console.log('[audit] success:', report.categories);
    res.json(report);
  } catch (err) {
    console.error('[audit] error:', err.stack || err);
    res.status(500).json({ error: err.message || 'Audit failed' });
  }
});

module.exports = router;
