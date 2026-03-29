#!/usr/bin/env node
/**
 * Claude Request Processor for OpenClaw
 * 
 * Monitors the Claude queue and processes requests by sending them to OpenClaw's main session.
 * Run this periodically via cron or heartbeat.
 */

import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/subhuti/.openclaw/workspace';
const QUEUE_DIR = join(WORKSPACE, '.claude-queue');

/**
 * Process pending Claude requests
 */
function processClaudeRequests() {
  if (!readdirSync(QUEUE_DIR).some(f => f.endsWith('.json'))) {
    console.log('📭 No pending Claude requests');
    return;
  }

  console.log('🔍 Checking for Claude requests...\n');

  const files = readdirSync(QUEUE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  let processed = 0;

  for (const file of files) {
    const filePath = join(QUEUE_DIR, file);
    const request = JSON.parse(readFileSync(filePath, 'utf-8'));

    if (request.status === 'completed' || request.status === 'processing') {
      continue; // Skip already processed
    }

    console.log(`📬 Processing: ${request.id}`);
    console.log(`   From: ${request.from}`);
    console.log(`   Priority: ${request.priority}`);
    console.log(`   Message: ${request.message.slice(0, 100)}...`);

    // Mark as processing
    request.status = 'processing';
    request.processedAt = new Date().toISOString();
    writeFileSync(filePath, JSON.stringify(request, null, 2));

    // Send to OpenClaw main session
    try {
      const message = `[🦌 Claude Code Request]\n\n${request.message}\n\n**Model:** ${request.model}\n**Priority:** ${request.priority}\n**Request ID:** ${request.id}`;
      
      // Use OpenClaw's sessions_send tool via CLI
      // This sends the message to the main session for processing
      execSync(`openclaw send --session "agent:main:main" "${message.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      // Mark as sent
      request.status = 'sent';
      request.sentAt = new Date().toISOString();
      writeFileSync(filePath, JSON.stringify(request, null, 2));

      console.log(`✅ Sent to OpenClaw main session\n`);
      processed++;
    } catch (error) {
      console.log(`❌ Error sending: ${error.message}\n`);
      request.status = 'error';
      request.error = error.message;
      writeFileSync(filePath, JSON.stringify(request, null, 2));
    }
  }

  console.log(`\n📊 Summary: Processed ${processed} request(s)`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processClaudeRequests();
}

export { processClaudeRequests };
