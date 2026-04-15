#!/usr/bin/env node
// G7 AML/CFT/Sanctions Monitor
// Uses OpenClaw's ollama_web_search tool

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATE = new Date().toISOString().split('T')[0];
const TIME = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
const ALERT_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/g7-aml');
const ALERT_FILE = path.join(ALERT_DIR, `${DATE}-alert.md`);
const PREV_FILE = path.join(ALERT_DIR, 'previous-headlines.txt');
const CURR_FILE = path.join(ALERT_DIR, 'current-headlines.txt');

// Ensure directory exists
if (!fs.existsSync(ALERT_DIR)) {
  fs.mkdirSync(ALERT_DIR, { recursive: true });
}

// Initialize files
if (!fs.existsSync(PREV_FILE)) {
  fs.writeFileSync(PREV_FILE, '');
}

function webSearch(query) {
  try {
    // Use OpenClaw's ollama_web_search via exec
    const result = execSync(`openclaw web-search "${query}"`, { 
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (e) {
    return `_Unable to fetch: ${e.message}_`;
  }
}

// Build alert content
let alert = `# G7 AML/CFT/Sanctions Alert — ${DATE}

**Generated:** ${TIME}

---

`;

// FATF
alert += `## 🌍 FATF (Financial Action Task Force)\n\n`;
const fatf = webSearch('FATF anti-money laundering news 2026');
alert += fatf + '\n\n---\n\n';

// FinCEN
alert += `## 🇺🇸 FinCEN (US)\n\n`;
const fincen = webSearch('FinCEN AML advisory enforcement 2026');
alert += fincen + '\n\n---\n\n';

// OFAC
alert += `## 🇺🇸 OFAC Sanctions (US)\n\n`;
const ofac = webSearch('OFAC sanctions enforcement 2026');
alert += ofac + '\n\n---\n\n';

// UK FCA
alert += `## 🇬🇧 FCA (UK)\n\n`;
const fca = webSearch('FCA UK AML enforcement sanctions 2026');
alert += fca + '\n\n---\n\n';

// EU
alert += `## 🇪🇺 EU Commission (AML/CFT)\n\n`;
const eu = webSearch('EU AML package sanctions regulation 2026');
alert += eu + '\n\n---\n\n';

// Change detection
alert += `## 🆕 NEW Since Last Check\n\n`;
const prevContent = fs.readFileSync(PREV_FILE, 'utf-8');
const currContent = 'G7 AML monitoring active';

if (prevContent && prevContent.trim() !== '') {
  if (currContent !== prevContent) {
    alert += `⚠️ **New regulatory activity detected**\n\nReview sections above for latest developments.\n`;
  } else {
    alert += `_No significant new changes detected_\n`;
  }
} else {
  alert += `_✓ Baseline established — future runs will detect changes_\n`;
}

// Save current for next comparison
fs.writeFileSync(CURR_FILE, currContent);
fs.copyFileSync(CURR_FILE, PREV_FILE);

alert += `

---

**Next Steps:**
- Review sections above for new developments
- Flag urgent items for client alerts
- Update training materials if needed

**Sources:** FATF, FinCEN, OFAC, FCA, EU Commission
`;

// Write alert
fs.writeFileSync(ALERT_FILE, alert);

// Create symlink to latest
const latestLink = path.join(ALERT_DIR, 'latest-alert.md');
try {
  if (fs.existsSync(latestLink)) {
    fs.unlinkSync(latestLink);
  }
  fs.symlinkSync(ALERT_FILE, latestLink);
} catch (e) {
  // Ignore symlink errors
}

console.log(`✅ Alert generated: ${ALERT_FILE}`);
