const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/fetch-product', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch {
      return res.status(503).json({
        error: 'Product scraping is not available on this server. Enter product details manually.'
      });
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (launchError) {
      console.error('Puppeteer launch failed:', launchError.message);
      return res.status(503).json({
        error: 'Product scraping is not available on this server. Enter product details manually.'
      });
    }

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      let productName = '';
      let productPrice = '';
      let productImage = '';

      if (url.includes('shein')) {
        productName = await page.$eval('.product-intro__head-name', el => el.textContent.trim()).catch(() => '');
        productPrice = await page.$eval('.product-intro__head-price', el => el.textContent.trim()).catch(() => '');
        productImage = await page.$eval('.product-intro__img-item img', el => el.src).catch(() => '');
      } else if (url.includes('temu')) {
        productName = await page.$eval('h1[class*="title"]', el => el.textContent.trim()).catch(() => '');
        productPrice = await page.$eval('[class*="price"]', el => el.textContent.trim()).catch(() => '');
        productImage = await page.$eval('img[class*="image"]', el => el.src).catch(() => '');
      } else {
        productName = await page.$eval('h1', el => el.textContent.trim()).catch(() => '');
        productPrice = await page.$eval('[class*="price"], .price', el => el.textContent.trim()).catch(() => '');
        productImage = await page.$eval('img[src*="product"], .product-image img, main img', el => el.src).catch(() => '');
      }

      res.json({
        product_name: productName,
        product_price_gbp: productPrice.replace(/[^0-9.]/g, '') || '0',
        product_image_url: productImage,
        product_url: url
      });
    } finally {
      if (browser) await browser.close();
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch product details' });
  }
});

module.exports = router;
