#!/usr/bin/env node
/**
 * Development server with .env.local loading
 * Loads environment variables before starting Nuxt
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Create a clean environment object with current env vars
const env = { ...process.env };

// Load .env.local file
const envLocalPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  let loadedCount = 0;
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (key) {
          env[key] = value;
          loadedCount++;
        }
      }
    }
  });
  console.log(`✓ Loaded .env.local (${loadedCount} variable(s))`);
  console.log(`  CLAUDE_PAPERS_DIR = ${env.CLAUDE_PAPERS_DIR || 'not set'}`);
}

// Start Nuxt dev server
const nuxt = spawn('npx', ['nuxt', 'dev', '--port', '5815'], {
  stdio: 'inherit',
  env: env  // Pass the environment with loaded variables
});

nuxt.on('exit', (code) => {
  process.exit(code || 0);
});
