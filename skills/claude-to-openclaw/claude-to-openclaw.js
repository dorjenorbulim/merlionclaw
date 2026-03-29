#!/usr/bin/env node
/**
 * Claude Code ↔ OpenClaw Integration
 * 
 * Sends tasks from Claude Code to OpenClaw via session messaging.
 * OpenClaw processes the task and responds in the same session.
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/subhuti/.openclaw/workspace';
const QUEUE_DIR = join(WORKSPACE, '.claude-queue');

// Ensure queue directory exists
if (!existsSync(QUEUE_DIR)) {
  mkdirSync(QUEUE_DIR, { recursive: true });
}

/**
 * Send message to OpenClaw by writing to queue file
 * OpenClaw's heartbeat or main session will pick this up
 */
function sendToOpenClaw(message, options = {}) {
  const {
    priority = 'normal',
    category = 'claude-request',
    model = 'qwen3.5:cloud'
  } = options;

  const timestamp = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  
  const request = {
    id,
    timestamp,
    from: 'claude-code',
    category,
    priority,
    model,
    message,
    status: 'pending'
  };

  const queueFile = join(QUEUE_DIR, `${id}.json`);
  writeFileSync(queueFile, JSON.stringify(request, null, 2));

  console.log('🦌 Task sent to OpenClaw');
  console.log(`   Queue ID: ${id}`);
  console.log(`   Priority: ${priority}`);
  console.log(`   Model: ${model}`);
  console.log(`\nOpenClaw will process this task shortly.`);
  console.log(`Check back with: /claude-to-openclaw status ${id}`);
  
  return id;
}

/**
 * Check status of a request
 */
function checkStatus(requestId) {
  const queueFile = join(QUEUE_DIR, `${requestId}.json`);
  
  if (!existsSync(queueFile)) {
    console.log('❌ Request not found. It may have been processed and cleaned up.');
    return null;
  }

  const request = JSON.parse(readFileSync(queueFile, 'utf-8'));
  
  console.log(`Request: ${requestId}`);
  console.log(`Status: ${request.status || 'pending'}`);
  console.log(`Sent: ${request.timestamp}`);
  console.log(`Message: ${request.message.slice(0, 100)}...`);
  
  if (request.response) {
    console.log(`\n📬 Response:`);
    console.log(request.response);
  }
  
  return request;
}

/**
 * List pending requests
 */
function listRequests() {
  const { readdirSync } = require('fs');
  
  const files = readdirSync(QUEUE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('📭 No pending requests');
    return [];
  }

  console.log(`📬 Pending Requests (${files.length}):\n`);
  
  files.forEach(file => {
    const request = JSON.parse(readFileSync(join(QUEUE_DIR, file), 'utf-8'));
    const statusIcon = request.status === 'completed' ? '✅' : 
                       request.status === 'processing' ? '⚙️' : '⏳';
    
    console.log(`${statusIcon} ${file.replace('.json', '')}`);
    console.log(`   ${request.timestamp}`);
    console.log(`   ${request.message.slice(0, 80)}...`);
    console.log();
  });

  return files;
}

/**
 * Clean up old completed requests
 */
function cleanup(oldDays = 7) {
  const { readdirSync, unlinkSync } = require('fs');
  
  const now = Date.now();
  const maxAge = oldDays * 24 * 60 * 60 * 1000;
  let cleaned = 0;

  const files = readdirSync(QUEUE_DIR);
  files.forEach(file => {
    if (!file.endsWith('.json')) return;
    
    const filePath = join(QUEUE_DIR, file);
    const request = JSON.parse(readFileSync(filePath, 'utf-8'));
    const age = now - new Date(request.timestamp).getTime();
    
    if (request.status === 'completed' && age > maxAge) {
      unlinkSync(filePath);
      cleaned++;
    }
  });

  console.log(`🧹 Cleaned up ${cleaned} old requests`);
  return cleaned;
}

/**
 * Check if OpenClaw is running
 */
function checkOpenClawStatus() {
  try {
    const output = execSync('openclaw status 2>&1', { encoding: 'utf-8' });
    
    if (output.includes('Gateway') && output.includes('reachable')) {
      console.log('✅ OpenClaw is running');
      
      // Extract gateway info
      const gatewayMatch = output.match(/Gateway.*reachable (\d+)ms/);
      if (gatewayMatch) {
        console.log(`   Latency: ${gatewayMatch[1]}ms`);
      }
      
      return true;
    } else {
      console.log('⚠️  OpenClaw may not be fully operational');
      return false;
    }
  } catch (error) {
    console.log('❌ OpenClaw is not running');
    console.log('   Start it with: openclaw start');
    return false;
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
🦌 Claude Code ↔ OpenClaw Integration

Usage:
  /claude-to-openclaw <command> [options]

Commands:
  send <message>       Send task to OpenClaw
  status [id]          Check request status (or list all)
  list                 List all pending requests
  cleanup [days]       Clean up old completed requests (default: 7 days)
  help                 Show this help

Options for 'send':
  --priority <level>   Priority: low|normal|high (default: normal)
  --model <name>       Model to use (default: qwen3.5:cloud)
  --category <cat>     Category for organization

Examples:
  /claude-to-openclaw send "Research AI agent frameworks"
  /claude-to-openclaw send --priority high "Urgent: Check email for important message"
  /claude-to-openclaw send --model deepseek-r1 "Complex reasoning task"
  /claude-to-openclaw status abc123
  /claude-to-openclaw list
  /claude-to-openclaw cleanup 3
  `);
  process.exit(0);
}

// Command handlers
switch (command) {
  case 'send': {
    const message = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
    
    if (!message) {
      console.log('❌ Please provide a message');
      process.exit(1);
    }
    
    // Parse options
    const options = {};
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--priority' && args[i + 1]) {
        options.priority = args[++i];
      } else if (args[i] === '--model' && args[i + 1]) {
        options.model = args[++i];
      } else if (args[i] === '--category' && args[i + 1]) {
        options.category = args[++i];
      }
    }
    
    sendToOpenClaw(message, options);
    break;
  }
  
  case 'status': {
    const requestId = args[1];
    if (requestId) {
      checkStatus(requestId);
    } else {
      listRequests();
    }
    break;
  }
  
  case 'list':
    listRequests();
    break;
  
  case 'cleanup': {
    const days = parseInt(args[1]) || 7;
    cleanup(days);
    break;
  }
  
  case 'check':
    checkOpenClawStatus();
    break;
  
  case 'help':
  default:
    console.log('Use /claude-to-openclaw without arguments to see help');
}
