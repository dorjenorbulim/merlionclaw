#!/usr/bin/env node

/**
 * Weather Edge Data API - Mock Server
 * 
 * This is a placeholder for the actual API server.
 * For now, we'll deliver data via:
 * 1. Email digests (automated, Sundays)
 * 2. Manual API access (CSV/JSON files on request)
 * 
 * Phase 2: Build full REST API with authentication
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Mock endpoint - returns latest mismatches
function getMismatches() {
  const latestFile = path.join(DATA_DIR, 'latest-mismatches.json');
  
  if (!fs.existsSync(latestFile)) {
    return {
      error: 'No data available yet',
      message: 'Data collection started April 7, 2026. First report: April 13, 2026.'
    };
  }
  
  return JSON.parse(fs.readFileSync(latestFile, 'utf8'));
}

// For now, data is delivered via:
// 1. Weekly newsletter (Beehiiv)
// 2. Manual CSV/JSON export on request
// 3. Full API coming in Phase 2

console.log('Weather Edge API - Mock Server');
console.log('First data delivery: Sunday, April 13, 2026');
console.log('Contact: michael@weatheredge.io');
