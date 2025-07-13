const express = require('express');
const axios = require('axios');
const cors = require('cors');
const puppeteer = require('puppeteer');
const axeCore = require('@axe-core/puppeteer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/evaluate', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL format
    new URL(url);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Inject and run axe-core
    await axeCore(page);
    const results = await page.evaluate(() => axe.run());
    
    await browser.close();

    // Calculate accessibility score
    const totalViolations = results.violations.reduce((sum, violation) => sum + violation.nodes.length, 0);
    const totalElements = results.passes.length + totalViolations;
    const accessibilityScore = totalElements > 0 
      ? Math.round((results.passes.length / totalElements) * 100) 
      : 0;

    res.json({
      score: accessibilityScore,
      violations: results.violations,
      passes: results.passes,
      url: url
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while evaluating the website' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});