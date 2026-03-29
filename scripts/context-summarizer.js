#!/usr/bin/env node
/**
 * Context Summarization Utility
 * 
 * DeerFlow-inspired context management for long-running tasks.
 * Compresses conversation history while preserving key information.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/subhuti/.openclaw/workspace';

/**
 * Summarize a conversation transcript
 * @param {string} transcriptPath - Path to session transcript
 * @param {number} targetCompression - Target compression ratio (0.2 = 20% of original)
 * @returns {Promise<string>} - Compressed summary
 */
export async function summarizeContext(transcriptPath, targetCompression = 0.2) {
  const transcript = readFileSync(transcriptPath, 'utf-8');
  const lines = transcript.split('\n');
  
  // Extract key elements to preserve
  const decisions = extractDecisions(lines);
  const facts = extractFacts(lines);
  const codeBlocks = extractCodeBlocks(lines);
  const fileReferences = extractFileReferences(lines);
  
  // Build compressed summary
  const summary = [
    '# Context Summary',
    `Generated: ${new Date().toISOString()}`,
    `Original lines: ${lines.length}`,
    `Compression target: ${targetCompression * 100}%`,
    '',
    '## Key Decisions',
    ...decisions.map(d => `- ${d}`),
    '',
    '## Important Facts',
    ...facts.map(f => `- ${f}`),
    '',
    '## Code Snippets',
    ...codeBlocks.map(c => `### ${c.name}\n${c.content}`),
    '',
    '## File References',
    ...fileReferences.map(f => `- ${f}`),
    '',
    '## Conversation Flow',
    summarizeConversationFlow(lines, targetCompression)
  ].join('\n');
  
  return summary;
}

/**
 * Extract decisions from conversation
 */
function extractDecisions(lines) {
  const decisions = [];
  const decisionKeywords = ['decided', 'decision', 'conclusion', 'agreed', 'will do', 'going to'];
  
  for (const line of lines) {
    if (decisionKeywords.some(kw => line.toLowerCase().includes(kw))) {
      const clean = line.replace(/^[^:]*:\s*/, '').trim();
      if (clean.length > 10 && clean.length < 200) {
        decisions.push(clean);
      }
    }
  }
  
  return decisions.slice(0, 20); // Limit to top 20 decisions
}

/**
 * Extract factual statements
 */
function extractFacts(lines) {
  const facts = [];
  const factPatterns = [
    /is (?:located|based|working|using|configured)/i,
    /has (?:been|already|not)/i,
    /version \d/i,
    /path:?\s*[\/~]/i,
    /api key|token|credential/i
  ];
  
  for (const line of lines) {
    if (factPatterns.some(p => p.test(line))) {
      const clean = line.replace(/^[^:]*:\s*/, '').trim();
      if (clean.length > 10 && clean.length < 150) {
        facts.push(clean);
      }
    }
  }
  
  return [...new Set(facts)].slice(0, 30); // Unique facts, limit 30
}

/**
 * Extract code blocks
 */
function extractCodeBlocks(lines) {
  const codeBlocks = [];
  let inCodeBlock = false;
  let codeContent = [];
  let codeName = 'snippet';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Starting code block
        inCodeBlock = true;
        codeName = line.match(/```(\w+)/)?.[1] || 'snippet';
        codeContent = [];
      } else {
        // Ending code block
        inCodeBlock = false;
        if (codeContent.length > 0 && codeContent.length < 100) {
          codeBlocks.push({
            name: `${codeName}-${codeBlocks.length + 1}`,
            content: codeContent.join('\n')
          });
        }
      }
    } else if (inCodeBlock) {
      codeContent.push(line);
    }
  }
  
  return codeBlocks.slice(0, 10); // Limit to 10 code blocks
}

/**
 * Extract file references
 */
function extractFileReferences(lines) {
  const files = new Set();
  const filePattern = /[\/~][\w\-\.\/]+(?:\.\w+)?/g;
  
  for (const line of lines) {
    const matches = line.match(filePattern);
    if (matches) {
      matches.forEach(f => {
        if (f.length > 3 && f.length < 100) {
          files.add(f);
        }
      });
    }
  }
  
  return Array.from(files).slice(0, 50);
}

/**
 * Summarize conversation flow
 */
function summarizeConversationFlow(lines, targetCompression) {
  // Group by speaker turns
  const turns = [];
  let currentTurn = { speaker: '', lines: [] };
  
  for (const line of lines) {
    const speakerMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (speakerMatch) {
      if (currentTurn.lines.length > 0) {
        turns.push(currentTurn);
      }
      currentTurn = {
        speaker: speakerMatch[1],
        lines: [speakerMatch[2]]
      };
    } else if (currentTurn.speaker) {
      currentTurn.lines.push(line);
    }
  }
  
  if (currentTurn.lines.length > 0) {
    turns.push(currentTurn);
  }
  
  // Compress turns based on target ratio
  const keepCount = Math.max(10, Math.floor(turns.length * targetCompression));
  const keptTurns = turns.slice(-keepCount); // Keep most recent turns
  
  return keptTurns.map(turn => 
    `**${turn.speaker}**: ${turn.lines.slice(0, 3).join(' ')}`
  ).join('\n\n');
}

/**
 * Compress old messages in a session
 */
export async function compressSession(sessionKey, options = {}) {
  const {
    keepLastMessages = 10,
    compressionRatio = 0.2,
    outputPath
  } = options;
  
  // This would integrate with OpenClaw's session API
  // For now, provide a template implementation
  
  console.log(`Compressing session: ${sessionKey}`);
  console.log(`Keeping last ${keepLastMessages} messages uncompressed`);
  console.log(`Compressing older messages to ${compressionRatio * 100}%`);
  
  const summary = {
    sessionKey,
    compressedAt: new Date().toISOString(),
    strategy: 'keep-recent-summarize-old',
    keepLastMessages,
    compressionRatio
  };
  
  if (outputPath) {
    writeFileSync(outputPath, JSON.stringify(summary, null, 2));
    console.log(`Summary written to: ${outputPath}`);
  }
  
  return summary;
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'summarize' && args[1]) {
    summarizeContext(args[1], parseFloat(args[2]) || 0.2)
      .then(summary => console.log(summary))
      .catch(err => console.error(err));
  } else if (args[0] === 'compress' && args[1]) {
    compressSession(args[1], {
      keepLastMessages: parseInt(args[2]) || 10,
      compressionRatio: parseFloat(args[3]) || 0.2
    });
  } else {
    console.log(`
Context Summarization Utility

Usage:
  node context-summarizer.js summarize <transcript.jsonl> [compression_ratio]
  node context-summarizer.js compress <session_key> [keep_last] [ratio]

Examples:
  node context-summarizer.js summarize session.jsonl 0.2
  node context-summarizer.js compress agent:main:main 10 0.2
    `);
  }
}
