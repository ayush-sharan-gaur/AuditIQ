const express = require('express');
const puppeteer = require('puppeteer');
const { runLighthouse } = require('../utils/lighthouseService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // 1) Get data
    const { categories, tips } = await runLighthouse(url);

    // 2) Build same HTML as PDF
    const html = `
      <html><head>
        <style>body{font-family:sans-serif;padding:2rem;}h1{text-align:center;}ul{list-style:none;padding:0;}li{margin:.5rem 0;}</style>
      </head><body>
        <h1>AuditIQ Report for ${url}</h1>
        ${Object.entries(categories)
          .map(([k,v]) => `<div><strong>${k}:</strong> ${Math.round(v*100)}%</div>`)
          .join('')}
        <ul>
          ${tips.map(t => `<li><strong>${t.title}:</strong> ${t.description}</li>`).join('')}
        </ul>
      </body></html>
    `;

    // 3) Launch headless Chrome
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 4) Screenshot
    const pngBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    // 5) Send PNG
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="audit-report.png"',
      'Content-Length': pngBuffer.length
    });
    res.send(pngBuffer);
  } catch (err) {
    console.error('[reportPng] error:', err.stack || err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;