#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Set the production URL for Playwright tests
const configPath = path.join(__dirname, '..', 'playwright.config.ts');

if (fs.existsSync(configPath)) {
  let config = fs.readFileSync(configPath, 'utf8');
  
  // Replace the baseURL with production URL
  config = config.replace(
    /baseURL: process\.env\.PLAYWRIGHT_TEST_BASE_URL \|\| '.*?'/,
    "baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://apt-portfolio.apt-account.workers.dev/'"
  );
  
  fs.writeFileSync(configPath, config);
  console.log('✅ Playwright config updated for production testing');
} else {
  console.error('❌ playwright.config.ts not found');
  process.exit(1);
}