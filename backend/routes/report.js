const express = require('express');
const puppeteer = require('puppeteer');
const { runLighthouse } = require('../utils/lighthouseService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send('URL is required');

  try {
    // 1) Run Lighthouse to get JSON data
    const { categories, tips } = await runLighthouse(url);

    // 2) Build a simple HTML string
    const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            h1 { text-align: center; }
            .scores div { margin: .5rem 0; }
            .tips li { margin: .25rem 0; }
          </style>
        </head>
        <body>
          <h1>AuditIQ Report for ${url}</h1>
          <section class="scores">
            <h2>Scores</h2>
            ${Object.entries(categories)
              .map(
                ([k, v]) =>
                  `<div><strong>${k}:</strong> ${Math.round(v * 100)}%</div>`
              )
              .join('')}
          </section>
          <section class="tips">
            <h2>Actionable Tips</h2>
            <ul>
              ${tips
                .map(
                  (t) =>
                    `<li><strong>${t.title}:</strong> ${t.description}</li>`
                )
                .join('')}
            </ul>
          </section>
        </body>
      </html>
    `;

    // 3) Launch Puppeteer, render and PDF
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // 4) Send PDF back
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="audit-report.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Report generation failed' });
  }
});

module.exports = router;
