// Renders scripts/og/og-image.html to static/og.png (the social link preview).
// Usage: node scripts/og/render.cjs   (needs Playwright + Chromium installed)
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await page.goto('file://' + path.join(__dirname, 'og-image.html'), { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: path.join(__dirname, '../../static/og.png') });
	await browser.close();
})();
