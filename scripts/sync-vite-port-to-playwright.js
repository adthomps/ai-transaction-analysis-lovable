#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read vite.config.ts to get the port
const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
const playwrightConfigPath = path.join(__dirname, '..', 'playwright.config.ts');

if (fs.existsSync(viteConfigPath) && fs.existsSync(playwrightConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const portMatch = viteConfig.match(/port:\s*(\d+)/);
  
  if (portMatch) {
    const port = portMatch[1];
    let playwrightConfig = fs.readFileSync(playwrightConfigPath, 'utf8');
    
    // Update the webServer configuration if it exists
    playwrightConfig = playwrightConfig.replace(
      /url: 'http:\/\/127\.0\.0\.1:\d+'/,
      `url: 'http://127.0.0.1:${port}'`
    );
    
    // Update baseURL for local development
    playwrightConfig = playwrightConfig.replace(
      /baseURL: process\.env\.PLAYWRIGHT_TEST_BASE_URL \|\| '.*?'/,
      `baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:${port}'`
    );
    
    fs.writeFileSync(playwrightConfigPath, playwrightConfig);
    console.log(`✅ Playwright config synced with Vite port ${port}`);
  }
} else {
  console.error('❌ Config files not found');
}