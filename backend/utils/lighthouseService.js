// backend/utils/lighthouseService.js

const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');

/**
 * Run a Lighthouse audit for the given URL.
 * Uses dynamic import for the ESM-only Lighthouse package.
 * @param {string} url
 * @returns {Promise<{categories: Record<string, number>, tips: Array<{id:string,title:string,description:string,score:number}>}>}
 */
async function runLighthouse(url) {
  // ① Dynamically import Lighthouse (ESM-only)
  const { default: lighthouse } = await import('lighthouse');

  // ② Launch Chrome via Puppeteer’s bundled binary
  const chromePath = puppeteer.executablePath();
  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  // ③ Configure Lighthouse options
  const options = {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
  };

  // ④ Run Lighthouse audit
  const runnerResult = await lighthouse(url, options);

  // ⑤ Kill Chrome
  await chrome.kill();

  // ⑥ Extract scores and actionable tips
  const { categories, audits } = runnerResult.lhr;
  const categoryScores = Object.fromEntries(
    Object.entries(categories).map(([key, cat]) => [key, cat.score])
  );
  const tips = Object.values(audits)
    .filter(audit => typeof audit.score === 'number' && audit.score < 1)
    .map(audit => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
    }));

  return { categories: categoryScores, tips };
}

module.exports = { runLighthouse };
