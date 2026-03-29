# Claude Code ↔ OpenClaw Integration

**Send tasks from Claude Code to OpenClaw via session messaging**

## Overview

This skill enables bidirectional communication between Claude Code (Anthropic's CLI agent) and OpenClaw. Use it to:
- Send research tasks to OpenClaw from Claude Code
- Get responses back to your terminal
- Leverage OpenClaw's sub-agent orchestration for complex tasks
- Access OpenClaw's memory, skills, and tools from Claude Code

**Architecture:** Uses OpenClaw's `sessions_send` tool to communicate between Claude Code and OpenClaw sessions.

## Prerequisites

1. **Claude Code installed:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **OpenClaw running:**
   ```bash
   openclaw start
   ```

3. **Both authenticated:**
   - Claude Code: `claude` (follow OAuth flow)
   - OpenClaw: Already configured

---

## Installation

### Option 1: Install as Claude Code Skill

```bash
cd ~/.claude/skills
cp -r /Users/subhuti/.openclaw/workspace/skills/claude-to-openclaw .
```

### Option 2: Manual Setup

Copy this skill folder to your Claude Code skills directory:
```bash
cp -r /path/to/workspace/skills/claude-to-openclaw ~/.claude/skills/
```

---

## Usage

### Basic Commands

Once installed, use `/claude-to-openclaw` in Claude Code:

```bash
/claude-to-openclaw <command> [options]
```

### Available Commands

| Command | Description |
|---------|-------------|
| `/claude-to-openclaw send <message>` | Send task to OpenClaw main session |
| `/claude-to-openclaw status` | Check if OpenClaw is accessible |
| `/claude-to-openclaw help` | Show help |

---

## Examples

### Example 1: Send Research Task

```bash
/claude-to-openclaw send "Research AI agent frameworks and compare LangChain, AutoGen, and CrewAI. Focus on multi-agent orchestration patterns."
```

**Output:**
```
🦌 OpenClaw received task
Thread: thread-abc123
Model: qwen3.5:cloud
Status: Processing...

[Streaming response appears here as OpenClaw works]
```

### Example 2: Check Status

```bash
/claude-to-openclaw status
```

**Output:**
```
✅ OpenClaw is healthy
Gateway: http://localhost:18789
Models: 4 available
Skills: 30 installed
Active threads: 2
```

### Example 3: List Models

```bash
/claude-to-openclaw models
```

**Output:**
```
Available Models:
- qwen3.5:cloud (default)
- deepseek-r1:latest
- gemma3:4b
- glm-4.7-flash:latest
```

### Example 4: Upload File for Analysis

```bash
/claude-to-openclaw upload ./research-paper.pdf
```

**Output:**
```
✅ Uploaded: research-paper.pdf
File ID: file-xyz789
Thread: thread-abc123

You can now reference this file in messages.
```

---

## Environment Variables

Configure via `.env` or export in shell:

```bash
# OpenClaw Gateway URL (default: http://localhost:18789)
export OPENCLAW_URL=http://localhost:18789

# LangGraph API URL (if using advanced features)
export OPENCLAW_LANGGRAPH_URL=http://localhost:2024

# Thread ID for persistent conversations
export OPENCLAW_THREAD_ID=my-research-thread

# Model preference
export OPENCLAW_MODEL=qwen3.5:cloud

# Enable streaming (default: true)
export OPENCLAW_STREAM=true

# Timeout in seconds (default: 300)
export OPENCLAW_TIMEOUT=300
```

---

## Advanced Usage

### Streaming Responses

Enable real-time streaming:

```bash
/claude-to-openclaw send --stream "Write a detailed analysis of..."
```

### Specify Model

```bash
/claude-to-openclaw send --model deepseek-r1 "Solve this complex reasoning problem..."
```

### Create New Thread

```bash
/claude-to-openclaw send --new-thread "Start fresh conversation about..."
```

### Attach Files

```bash
/claude-to-openclaw send --attach file1.pdf --attach file2.md "Analyze these documents..."
```

### Set Execution Mode

```bash
# Flash mode (fast, simple tasks)
/claude-to-openclaw send --mode flash "Quick fact check..."

# Standard mode (default)
/claude-to-openclaw send --mode standard "Regular task..."

# Pro mode (with planning)
/claude-to-openclaw send --mode pro "Complex multi-step task..."

# Ultra mode (with sub-agents)
/claude-to-openclaw send --mode ultra "Research project requiring multiple agents..."
```

---

## Integration Patterns

### Pattern 1: Claude Code as Frontend, OpenClaw as Backend

Use Claude Code for quick tasks, delegate complex research to OpenClaw:

```bash
# In Claude Code
claude "Help me outline a blog post about AI productivity"

# Then delegate research to OpenClaw
/claude-to-openclaw send "Research latest AI productivity tools and trends for Q1 2026"

# Bring results back to Claude Code for writing
claude "Here's the research from OpenClaw: [paste results]. Now write the blog post."
```

### Pattern 2: Parallel Research

Spawn multiple OpenClaw sub-agents from Claude Code:

```bash
/claude-to-openclaw send --mode ultra "Research: 1) Market size 2) Competitors 3) Customer needs 4) Pricing models"
```

### Pattern 3: File Processing Pipeline

```bash
# Upload files from Claude Code
/claude-to-openclaw upload ./data.csv

# Process in OpenClaw
/claude-to-openclaw send "Analyze this dataset and generate insights"

# Retrieve results
/claude-to-openclaw thread <thread-id>
```

---

## API Reference

### HTTP Endpoints

If you prefer direct API calls:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message, get response |
| `/api/threads` | GET | List threads |
| `/api/threads/:id` | GET | Get thread history |
| `/api/threads/:id` | DELETE | Delete thread |
| `/api/models` | GET | List models |
| `/api/skills` | GET | List skills |
| `/api/files/upload` | POST | Upload file |

### Example: Direct API Call

```bash
curl -X POST http://localhost:18789/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello OpenClaw!",
    "thread_id": "my-thread"
  }'
```

---

## Troubleshooting

### OpenClaw Not Running

```bash
# Check status
openclaw status

# Start gateway
openclaw gateway start
```

### Connection Refused

```bash
# Verify URL
echo $OPENCLAW_URL

# Test connection
curl http://localhost:18789/api/health
```

### Authentication Issues

```bash
# Re-authenticate Claude Code
claude logout
claude login

# Verify OpenClaw auth
openclaw status
```

### Timeout Errors

```bash
# Increase timeout
export OPENCLAW_TIMEOUT=600

# Or use async mode
/claude-to-openclaw send --async "Long-running task..."
```

---

## Best Practices

### 1. Use Right Tool for the Job

**Claude Code for:**
- Quick Q&A
- Code editing in current directory
- Simple file operations
- Immediate feedback tasks

**OpenClaw for:**
- Long-running research
- Multi-agent orchestration
- Complex workflows
- Tasks requiring memory/persistence
- Email/calendar integration

### 2. Thread Management

- Create dedicated threads for projects
- Clean up old threads periodically
- Use descriptive thread names

### 3. File Handling

- Upload large files before sending messages
- Reference file IDs in messages
- Clean up uploaded files when done

### 4. Error Handling

- Check OpenClaw status before sending
- Use `--async` for very long tasks
- Monitor thread status for progress

---

## Comparison: Claude Code vs OpenClaw

| Feature | Claude Code | OpenClaw |
|---------|-------------|----------|
| **Primary Use** | Code editing, quick tasks | Long-horizon agent orchestration |
| **Models** | Claude models only | Any Ollama/compatible model |
| **Memory** | Session-only | Persistent across sessions |
| **Sub-Agents** | Limited | Full orchestration |
| **Channels** | Terminal only | Telegram, WhatsApp, etc. |
| **Skills** | Claude skills | OpenClaw skills + custom |
| **Best For** | Immediate coding tasks | Research, content, workflows |

---

## Version History

- **v1.0** (March 2026) — Initial release
  - Basic send/receive functionality
  - Thread management
  - File upload support
  - Model selection

---

**License:** MIT  
**Author:** OpenClaw Community  
**Compatibility:** Claude Code 1.0+, OpenClaw 2026.3+
