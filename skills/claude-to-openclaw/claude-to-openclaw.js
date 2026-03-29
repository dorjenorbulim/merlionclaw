#!/usr/bin/env node
/**
 * Claude Code ↔ OpenClaw Integration
 * 
 * Enables sending tasks from Claude Code to OpenClaw and receiving streaming responses.
 * Similar to DeerFlow's claude-to-deerflow skill.
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const OPENCLAW_URL = process.env.OPENCLAW_URL || 'http://localhost:18789';
const OPENCLAW_TIMEOUT = parseInt(process.env.OPENCLAW_TIMEOUT) || 300;
const THREAD_FILE = join(__dirname, '.openclaw-thread.json');

/**
 * Get or create thread ID
 */
function getThreadId() {
  if (existsSync(THREAD_FILE)) {
    const data = JSON.parse(readFileSync(THREAD_FILE, 'utf-8'));
    return data.threadId;
  }
  return null;
}

/**
 * Save thread ID
 */
function saveThreadId(threadId) {
  writeFileSync(THREAD_FILE, JSON.stringify({ threadId, createdAt: new Date().toISOString() }, null, 2));
}

/**
 * Send message to OpenClaw
 */
async function sendMessage(message, options = {}) {
  const {
    threadId = getThreadId(),
    model = process.env.OPENCLAW_MODEL || 'qwen3.5:cloud',
    stream = process.env.OPENCLAW_STREAM !== 'false',
    mode = 'standard',
    attachments = []
  } = options;

  console.log(`🦌 Sending to OpenClaw (${model})...`);
  
  const payload = {
    message,
    thread_id: threadId,
    model,
    mode,
    attachments
  };

  try {
    const response = await fetch(`${OPENCLAW_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(OPENCLAW_TIMEOUT * 1000)
    });

    if (!response.ok) {
      throw new Error(`OpenClaw error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save thread ID for future use
    if (data.thread_id) {
      saveThreadId(data.thread_id);
    }

    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
}

/**
 * Check OpenClaw health
 */
async function checkHealth() {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/health`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenClaw is healthy');
      console.log(`   Gateway: ${OPENCLAW_URL}`);
      console.log(`   Version: ${data.version || 'unknown'}`);
      console.log(`   Models: ${data.models || 'unknown'}`);
      return true;
    } else {
      console.log('⚠️  OpenClaw returned non-OK status');
      return false;
    }
  } catch (error) {
    console.log('❌ OpenClaw is not reachable');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure OpenClaw is running: openclaw start');
    return false;
  }
}

/**
 * List available models
 */
async function listModels() {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/models`);
    const data = await response.json();
    
    console.log('Available Models:');
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach(m => {
        const defaultMarker = m.id === process.env.OPENCLAW_MODEL ? ' (default)' : '';
        console.log(`  - ${m.id}${defaultMarker}`);
      });
    } else {
      console.log('  No models found or API not available');
    }
    
    return data.models || [];
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * List skills
 */
async function listSkills() {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/skills`);
    const data = await response.json();
    
    console.log('Installed Skills:');
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach(s => {
        console.log(`  - ${s.name || s.id}`);
      });
      console.log(`\nTotal: ${data.skills.length} skills`);
    } else {
      console.log('  No skills found or API not available');
    }
    
    return data.skills || [];
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * List threads
 */
async function listThreads() {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/threads`);
    const data = await response.json();
    
    console.log('Active Threads:');
    if (data.threads && Array.isArray(data.threads)) {
      data.threads.forEach(t => {
        const currentMarker = t.id === getThreadId() ? ' (current)' : '';
        console.log(`  - ${t.id}${currentMarker}`);
        console.log(`    Created: ${new Date(t.createdAt).toLocaleString()}`);
        console.log(`    Messages: ${t.messageCount || 0}`);
      });
    } else {
      console.log('  No threads found');
    }
    
    return data.threads || [];
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * Get thread history
 */
async function getThreadHistory(threadId) {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/threads/${threadId}`);
    const data = await response.json();
    
    console.log(`Thread: ${threadId}`);
    console.log(`Messages: ${data.messages?.length || 0}\n`);
    
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤' : '🤖';
        console.log(`${role} ${msg.content?.slice(0, 200) || '...'}`);
        if (msg.content && msg.content.length > 200) {
          console.log('   ...');
        }
        console.log();
      });
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Upload file
 */
async function uploadFile(filePath) {
  try {
    const fileContent = readFileSync(filePath);
    const fileName = filePath.split('/').pop();
    
    const formData = new FormData();
    formData.append('file', new Blob([fileContent], { type: 'application/octet-stream' }), fileName);
    
    const response = await fetch(`${OPENCLAW_URL}/api/files/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ File uploaded successfully');
      console.log(`   File ID: ${data.fileId || 'unknown'}`);
      console.log(`   Name: ${fileName}`);
      return data;
    } else {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Delete thread
 */
async function deleteThread(threadId) {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/threads/${threadId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('✅ Thread deleted');
      if (threadId === getThreadId()) {
        writeFileSync(THREAD_FILE, '{}');
      }
      return true;
    } else {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
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
  send <message>       Send message to OpenClaw
  status               Check OpenClaw health
  models               List available models
  skills               List installed skills
  threads              List active threads
  thread <id>          Get thread history
  upload <file>        Upload file
  delete-thread [id]   Delete thread (or current)
  help                 Show this help

Options:
  --model <name>       Specify model
  --thread <id>        Specify thread
  --new-thread         Create new thread
  --mode <mode>        Execution mode (flash|standard|pro|ultra)
  --attach <file>      Attach file

Examples:
  /claude-to-openclaw send "Research AI frameworks"
  /claude-to-openclaw send --mode ultra "Complex research task"
  /claude-to-openclaw models
  /claude-to-openclaw upload ./document.pdf
  `);
  process.exit(0);
}

// Command handlers
(async () => {
  try {
    switch (command) {
      case 'send': {
        const message = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
        if (!message) {
          console.log('❌ Please provide a message');
          process.exit(1);
        }
        
        const options = {};
        
        // Parse options
        for (let i = 1; i < args.length; i++) {
          if (args[i] === '--model' && args[i + 1]) {
            options.model = args[++i];
          } else if (args[i] === '--thread' && args[i + 1]) {
            options.threadId = args[++i];
          } else if (args[i] === '--new-thread') {
            options.threadId = null; // Force new thread
          } else if (args[i] === '--mode' && args[i + 1]) {
            options.mode = args[++i];
          } else if (args[i] === '--attach' && args[i + 1]) {
            options.attachments = options.attachments || [];
            options.attachments.push(args[++i]);
          }
        }
        
        const result = await sendMessage(message, options);
        
        console.log('\n🦌 OpenClaw Response:');
        console.log(`Thread: ${result.thread_id || 'new'}`);
        console.log(`Model: ${result.model || 'default'}`);
        console.log('\n' + '='.repeat(50));
        
        if (result.response) {
          console.log(result.response);
        } else if (result.streaming) {
          console.log('[Streaming response - check thread for full output]');
        }
        
        console.log('='.repeat(50));
        break;
      }
      
      case 'status':
        await checkHealth();
        break;
      
      case 'models':
        await listModels();
        break;
      
      case 'skills':
        await listSkills();
        break;
      
      case 'threads':
        await listThreads();
        break;
      
      case 'thread': {
        const threadId = args[1] || getThreadId();
        if (!threadId) {
          console.log('❌ No thread ID provided and no current thread');
          process.exit(1);
        }
        await getThreadHistory(threadId);
        break;
      }
      
      case 'upload': {
        const filePath = args[1];
        if (!filePath) {
          console.log('❌ Please provide a file path');
          process.exit(1);
        }
        await uploadFile(filePath);
        break;
      }
      
      case 'delete-thread': {
        const threadId = args[1] || getThreadId();
        if (!threadId) {
          console.log('❌ No thread ID provided');
          process.exit(1);
        }
        await deleteThread(threadId);
        break;
      }
      
      case 'help':
      default:
        console.log('Use /claude-to-openclaw without arguments to see help');
    }
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
})();
