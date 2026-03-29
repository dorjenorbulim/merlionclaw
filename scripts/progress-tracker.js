#!/usr/bin/env node
/**
 * Progress Tracker for Long-Running Tasks
 * 
 * DeerFlow-inspired progress tracking with milestone updates.
 * Integrates with OpenClaw's session messaging system.
 */

import { writeFileSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/subhuti/.openclaw/workspace';
const PROGRESS_LOG = join(WORKSPACE, 'memory', 'progress-tracker.json');

/**
 * Track progress of a long-running task
 */
export class ProgressTracker {
  constructor(taskId, taskName, milestones = []) {
    this.taskId = taskId;
    this.taskName = taskName;
    this.milestones = milestones;
    this.currentMilestone = 0;
    this.startTime = Date.now();
    this.updates = [];
    
    this.log('started', 'Task initialized');
  }
  
  /**
   * Log progress update
   */
  log(status, message, metadata = {}) {
    const update = {
      timestamp: Date.now(),
      elapsed: Date.now() - this.startTime,
      status,
      message,
      milestone: this.currentMilestone,
      ...metadata
    };
    
    this.updates.push(update);
    this.save();
    
    // Output for immediate visibility
    const emoji = this.getEmoji(status);
    console.log(`${emoji} [${this.taskName}] ${message}`);
    
    return update;
  }
  
  /**
   * Update milestone progress
   */
  milestone(milestoneName, progress = 100) {
    const milestoneIndex = this.milestones.findIndex(m => m.name === milestoneName);
    
    if (milestoneIndex !== -1) {
      this.currentMilestone = milestoneIndex;
    }
    
    const totalMilestones = this.milestones.length || 1;
    const overallProgress = Math.round(((this.currentMilestone + (progress / 100)) / totalMilestones) * 100);
    
    return this.log('milestone', `Completed: ${milestoneName} (${progress}%)`, {
      milestoneName,
      milestoneProgress: progress,
      overallProgress
    });
  }
  
  /**
   * Send progress to main session
   */
  async notifySession(sessionKey, message) {
    // This would integrate with sessions_send tool
    // For now, log to file for later retrieval
    const notification = {
      sessionKey,
      message: `📊 **Progress Update: ${this.taskName}**\n${message}`,
      timestamp: Date.now()
    };
    
    appendFileSync(
      PROGRESS_LOG,
      JSON.stringify(notification) + '\n',
      'utf-8'
    );
    
    return notification;
  }
  
  /**
   * Get progress summary
   */
  getSummary() {
    const totalMilestones = this.milestones.length;
    const completedMilestones = this.currentMilestone + 1;
    const progress = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;
    
    return {
      taskId: this.taskId,
      taskName: this.taskName,
      progress,
      completedMilestones,
      totalMilestones,
      currentMilestoneName: this.milestones[this.currentMilestone]?.name || 'Unknown',
      elapsed: Date.now() - this.startTime,
      elapsedFormatted: this.formatDuration(Date.now() - this.startTime),
      updateCount: this.updates.length,
      lastUpdate: this.updates[this.updates.length - 1]
    };
  }
  
  /**
   * Mark task as complete
   */
  complete(finalOutput = {}) {
    const summary = this.getSummary();
    
    this.log('completed', 'Task finished successfully', {
      finalOutput,
      summary
    });
    
    return summary;
  }
  
  /**
   * Mark task as failed
   */
  fail(error, recoveryPlan = null) {
    const summary = this.getSummary();
    
    this.log('failed', `Task failed: ${error.message || error}`, {
      error: error.message || error,
      recoveryPlan,
      summary
    });
    
    return summary;
  }
  
  /**
   * Save progress to file
   */
  save() {
    const data = {
      taskId: this.taskId,
      taskName: this.taskName,
      milestones: this.milestones,
      currentMilestone: this.currentMilestone,
      startTime: this.startTime,
      updates: this.updates,
      lastSaved: Date.now()
    };
    
    writeFileSync(
      join(WORKSPACE, 'memory', `progress-${this.taskId}.json`),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  }
  
  /**
   * Load existing progress
   */
  static load(taskId) {
    const progressFile = join(WORKSPACE, 'memory', `progress-${taskId}.json`);
    
    try {
      const data = JSON.parse(readFileSync(progressFile, 'utf-8'));
      const tracker = new ProgressTracker(taskId, data.taskName, data.milestones);
      tracker.currentMilestone = data.currentMilestone;
      tracker.startTime = data.startTime;
      tracker.updates = data.updates;
      return tracker;
    } catch (err) {
      return null;
    }
  }
  
  /**
   * Get emoji for status
   */
  getEmoji(status) {
    const emojiMap = {
      'started': '🚀',
      'running': '⚙️',
      'milestone': '✅',
      'waiting': '⏳',
      'completed': '🎉',
      'failed': '❌',
      'error': '⚠️'
    };
    return emojiMap[status] || '📊';
  }
  
  /**
   * Format duration in ms to human readable
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

/**
 * Create a progress tracker for sub-agent tasks
 */
export function createSubagentTracker(taskId, taskName, milestones = []) {
  const tracker = new ProgressTracker(taskId, taskName, milestones);
  
  // Auto-save on exit
  process.on('exit', () => {
    tracker.save();
  });
  
  process.on('SIGINT', () => {
    tracker.log('interrupted', 'Task interrupted by user');
    tracker.save();
    process.exit(130);
  });
  
  return tracker;
}

/**
 * Get all active progress trackers
 */
export function getActiveTrackers() {
  const { readdirSync } = require('fs');
  const { join } = require('path');
  
  try {
    const files = readdirSync(join(WORKSPACE, 'memory'))
      .filter(f => f.startsWith('progress-') && f.endsWith('.json'));
    
    return files.map(f => {
      const taskId = f.replace('progress-', '').replace('.json', '');
      const tracker = ProgressTracker.load(taskId);
      return tracker ? tracker.getSummary() : null;
    }).filter(Boolean);
  } catch (err) {
    return [];
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'status') {
    const trackers = getActiveTrackers();
    console.log('📊 Active Progress Trackers\n');
    
    if (trackers.length === 0) {
      console.log('No active trackers');
    } else {
      trackers.forEach(t => {
        console.log(`\n**${t.taskName}** (${t.taskId})`);
        console.log(`   Progress: ${t.progress}%`);
        console.log(`   Milestone: ${t.currentMilestoneName}`);
        console.log(`   Elapsed: ${t.elapsedFormatted}`);
        console.log(`   Updates: ${t.updateCount}`);
      });
    }
  } else if (args[0] === 'demo') {
    // Demo usage
    const tracker = createSubagentTracker(
      'demo-task',
      'Research Report Generation',
      [
        { name: 'Gather requirements', duration: 1000 },
        { name: 'Research phase', duration: 3000 },
        { name: 'Analysis', duration: 2000 },
        { name: 'Writing', duration: 2000 },
        { name: 'Review', duration: 1000 }
      ]
    );
    
    console.log('🚀 Starting demo task...\n');
    
    tracker.milestones.forEach((m, i) => {
      setTimeout(() => {
        tracker.milestone(m.name);
        
        if (i === tracker.milestones.length - 1) {
          const summary = tracker.complete();
          console.log('\n🎉 Task completed!');
          console.log(`Total time: ${summary.elapsedFormatted}`);
        }
      }, m.duration);
    });
  } else {
    console.log(`
Progress Tracker - DeerFlow-inspired task monitoring

Usage:
  node progress-tracker.js status     - Show all active trackers
  node progress-tracker.js demo       - Run demo

Example in code:
  const tracker = createSubagentTracker('task-1', 'My Task', [
    { name: 'Phase 1' },
    { name: 'Phase 2' },
    { name: 'Phase 3' }
  ]);
  
  tracker.milestone('Phase 1');
  tracker.log('running', 'Working on phase 2...');
  tracker.complete();
    `);
  }
}
