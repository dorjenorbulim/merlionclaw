# 🦌 DeerFlow Features for OpenClaw

**Enhanced agent orchestration inspired by DeerFlow v2**

This document describes the DeerFlow-inspired enhancements added to your OpenClaw setup.

---

## ✅ What's Been Added

### 1. Sub-Agent Orchestrator Skill
**Location:** `skills/subagent-orchestrator/SKILL.md`

**What it does:**
- Coordinates multiple sub-agents for complex tasks
- Implements fan-out/fan-in patterns
- Provides result aggregation strategies
- Ensures context isolation between sub-agents

**When to use:**
- Research tasks requiring multiple angles
- Content generation with parallel workflows
- Data analysis across multiple sources
- Any task that can be decomposed into independent sub-tasks

---

### 2. Context Summarizer
**Location:** `scripts/context-summarizer.js`

**What it does:**
- Compresses conversation history while preserving key information
- Extracts decisions, facts, code blocks, and file references
- Reduces context window usage for long-running tasks
- Maintains conversation flow summary

**When to use:**
- Sessions approaching context limits
- Multi-hour tasks with extensive history
- Before spawning new sub-agents to keep context lean
- Archiving completed projects

**Usage:**
```bash
# Summarize a session transcript
node scripts/context-summarizer.js summarize session.jsonl 0.2

# Compress active session
node scripts/context-summarizer.js compress agent:main:main 10 0.2
```

---

### 3. Progress Tracker
**Location:** `scripts/progress-tracker.js`

**What it does:**
- Tracks milestones for long-running tasks
- Provides progress updates to main session
- Logs elapsed time and completion estimates
- Saves progress state for recovery

**When to use:**
- Tasks expected to take >10 minutes
- Multi-phase workflows
- When you want visibility into sub-agent progress
- For accountability and time tracking

**Usage:**
```javascript
const tracker = createSubagentTracker('task-id', 'Task Name', [
  { name: 'Research' },
  { name: 'Analysis' },
  { name: 'Writing' },
  { name: 'Review' }
]);

tracker.milestone('Research');
tracker.log('running', 'Starting analysis phase...');
tracker.complete();
```

---

## 📊 Feature Comparison: OpenClaw vs DeerFlow

| Feature | DeerFlow v2 | OpenClaw (Original) | OpenClaw (Enhanced) |
|---------|-------------|---------------------|---------------------|
| **Sub-Agents** | ✅ Isolated contexts | ✅ Basic spawn | ✅ + Orchestration patterns |
| **Memory** | ✅ Persistent facts | ✅ MEMORY.md | ✅ + Deduplication |
| **Sandbox** | ✅ Docker containers | ⚠️ Local exec only | ⚠️ Same (future: Docker) |
| **Skills** | ✅ SKILL.md files | ✅ SKILL.md files | ✅ Same system |
| **Context Mgmt** | ✅ Auto-summarization | ❌ Manual | ✅ Context summarizer |
| **Progress Tracking** | ✅ Built-in | ❌ Manual | ✅ Progress tracker |
| **MCP Servers** | ✅ Supported | ❌ Not implemented | ⏳ Planned |
| **IM Channels** | ✅ Telegram, Slack, Feishu | ✅ Telegram, WhatsApp | ✅ Same |
| **Observability** | ✅ LangSmith tracing | ⚠️ Basic logs | ⏳ Planned |

---

## 🚀 Quick Start Examples

### Example 1: Multi-Angle Research

```typescript
// Main agent: Research "AI agent frameworks"

// Phase 1: Fan-out research
const tasks = [
  "Research LangChain/LangGraph architecture",
  "Research AutoGen multi-agent patterns", 
  "Research CrewAI role-based agents",
  "Research OpenClaw architecture"
];

const subagents = await Promise.all(
  tasks.map(task => sessions_spawn({ 
    task, 
    label: `research-${task.split(' ')[1]}`,
    runtime: "subagent"
  }))
);

await sessions_yield(); // Wait for all

// Phase 2: Collect results
const results = [];
for (const agent of subagents) {
  const history = await sessions_history({ sessionKey: agent });
  results.push(extractKeyFindings(history));
}

// Phase 3: Synthesize
const synthesis = await sessions_spawn({
  task: `Compare these frameworks:\n\n${results.join('\n\n')}`,
  label: "analyst"
});

await sessions_yield();
```

---

### Example 2: Content Generation Pipeline

```typescript
// Task: Generate blog post + social media posts

// Sub-agent 1: Write blog post
const blog = await sessions_spawn({
  task: "Write 2000-word blog post about AI productivity",
  label: "writer"
});
await sessions_yield();

// Sub-agent 2: Extract key quotes
const quotes = await sessions_spawn({
  task: `Extract 10 tweetable quotes from this post:\n\n${blogResult}`,
  label: "quote-extractor"
});

// Sub-agent 3: Generate social posts
const social = await sessions_spawn({
  task: `Create platform-specific posts:\n- Twitter thread\n- LinkedIn post\n- Reddit post\n\nFrom this content:\n${blogResult}`,
  label: "social-manager"
});

await sessions_yield();

// Final: Review and package
const package = await sessions_spawn({
  task: "Package all outputs with proper formatting",
  label: "packager"
});
```

---

### Example 3: Code Analysis with Progress Tracking

```javascript
// Import progress tracker
import { createSubagentTracker } from './scripts/progress-tracker.js';

const tracker = createSubagentTracker('code-audit', 'Codebase Security Audit', [
  { name: 'Scan dependencies' },
  { name: 'Analyze code patterns' },
  { name: 'Check configurations' },
  { name: 'Generate report' }
]);

// Phase 1
const deps = await sessions_spawn({
  task: "Audit npm dependencies for vulnerabilities",
  label: "security-scan"
});
tracker.milestone('Scan dependencies');

// Phase 2
const code = await sessions_spawn({
  task: "Scan for security anti-patterns in src/",
  label: "code-scan"
});
tracker.milestone('Analyze code patterns');

// Phase 3
const config = await sessions_spawn({
  task: "Review security configurations",
  label: "config-scan"
});
tracker.milestone('Check configurations');

// Phase 4
const report = await sessions_spawn({
  task: `Compile security report:\n${deps}\n${code}\n${config}`,
  label: "reporter"
});
tracker.complete();
```

---

## 🧠 Best Practices

### 1. Task Decomposition

**Do:**
- Break tasks into independent sub-tasks
- Give each sub-agent a clear, scoped objective
- Define success criteria upfront

**Don't:**
- Create vague or overlapping tasks
- Spawn too many sub-agents (>10 can get unwieldy)
- Forget to aggregate results

### 2. Context Management

**Do:**
- Summarize completed phases
- Pass only relevant context to sub-agents
- Use attachments for large data

**Don't:**
- Dump entire conversation history
- Assume sub-agents know prior context
- Forget to compress old messages

### 3. Progress Visibility

**Do:**
- Set clear milestones
- Log progress at key points
- Save state for recovery

**Don't:**
- Over-log (every 30 seconds is too much)
- Forget to mark completion
- Skip error logging

---

## 📈 Metrics to Track

| Metric | How to Measure | Target |
|--------|----------------|--------|
| **Sub-agent success rate** | `successful / total` | >90% |
| **Average completion time** | Track elapsed per task | Task-dependent |
| **Token efficiency** | `output_tokens / input_tokens` | >0.3 |
| **Context utilization** | `used_context / max_context` | <80% |
| **Parallel speedup** | `sequential_time / parallel_time` | 2-5x |

---

## 🔧 Integration Points

### With Existing OpenClaw Tools

| Tool | Enhancement |
|------|-------------|
| `sessions_spawn` | Use orchestrator patterns for better coordination |
| `subagents` | Track with progress tracker |
| `sessions_yield` | Aggregate results after yield |
| `memory_get` / `memory_search` | Summarize before storing |
| `exec` | Track long-running processes with progress tracker |
| `cron` | Schedule periodic progress reports |

---

## 🛠️ Future Enhancements (Planned)

### Phase 2 (Next iteration):
- [ ] **Docker Sandbox** - Isolated exec environment
- [ ] **MCP Server Integration** - Extensible tool servers
- [ ] **Auto-retry Logic** - Handle sub-agent failures gracefully
- [ ] **Result Validation** - Verify sub-agent output quality

### Phase 3 (Advanced):
- [ ] **LangSmith-style Tracing** - Observability dashboard
- [ ] **Embedded Python Client** - Direct API access
- [ ] **Skill Marketplace** - Share/install community skills
- [ ] **IM Channel Expansion** - Slack, Feishu support

---

## 📚 Additional Resources

- **DeerFlow v2 Original:** https://github.com/bytedance/deer-flow
- **OpenClaw Docs:** /opt/homebrew/lib/node_modules/openclaw/docs
- **Skill Creation Guide:** `skills/skill-creator/SKILL.md`

---

**Last Updated:** March 29, 2026  
**Version:** 1.0  
**Author:** OpenClaw Community
