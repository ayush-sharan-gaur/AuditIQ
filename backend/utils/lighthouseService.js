// backend/utils/lighthouseService.js

// 1) Import Lighthouse (handle ESM vs CJS default export)
const rawLighthouse = require('lighthouse');
const lighthouse = typeof rawLighthouse === 'function'
  ? rawLighthouse
  : rawLighthouse.lighthouse || rawLighthouse.default || rawLighthouse;

const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');

async function runLighthouse(url) {
  // Launch Chrome via Puppeteer’s bundled binary
  const chromeExecutablePath = puppeteer.executablePath();
  const chrome = await chromeLauncher.launch({
    chromePath: chromeExecutablePath,
    chromeFlags: ['--headless', '--no-sandbox']
  });

  const options = {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices']
  };

  // Run Lighthouse audit
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  // Extract scores and actionable tips
  const categories = runnerResult.lhr.categories;
  const audits = runnerResult.lhr.audits;
  const tips = Object.values(audits)
    .filter(a => a.score < 1 && a.displayValue)
    .map(a => ({ title: a.title, description: a.displayValue }));

  return {
    categories: Object.fromEntries(
      Object.entries(categories).map(([key, cat]) => [key, cat.score])
    ),
    tips
  };
}

module.exports = { runLighthouse };
