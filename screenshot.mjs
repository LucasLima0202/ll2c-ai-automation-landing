// Usage: node screenshot.mjs <url> [label]
// Saves to "./temporary screenshots/screenshot-N[-label].png" (auto-incremented, never overwritten).
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PUPPETEER_DIR = 'C:/Users/nfbol/tools/puppeteer/';
const require = createRequire(PUPPETEER_DIR);
const puppeteer = require('puppeteer');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'temporary screenshots');
fs.mkdirSync(outDir, { recursive: true });

let n = 1;
for (const f of fs.readdirSync(outDir)) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) n = Math.max(n, Number(m[1]) + 1);
}
const file = path.join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 500)); // let fonts/animations settle
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Saved ${file}`);
} finally {
  await browser.close();
}
