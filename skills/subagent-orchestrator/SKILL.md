# Sub-Agent Orchestrator Skill

**Enhanced sub-agent coordination with result aggregation and progress tracking**

## Overview

This skill enhances OpenClaw's native `sessions_spawn` and `subagents` tools with DeerFlow-inspired orchestration patterns:
- Isolated sub-agent contexts
- Automatic result aggregation
- Progress tracking for long-running tasks
- Parallel execution when possible

## Usage

### Basic Pattern

```typescript
// Spawn multiple sub-agents for parallel work
const subagents = await Promise.all([
  sessions_spawn({
    task: "Research topic A",
    label: "researcher-a",
    runtime: "subagent",
    mode: "run"
  }),
  sessions_spawn({
    task: "Research topic B", 
    label: "researcher-b",
    runtime: "subagent",
    mode: "run"
  })
]);

// Wait for completion and aggregate results
const results = await Promise.all(
  subagents.map(id => waitForSubagent(id))
);

// Synthesize final output
const synthesis = synthesizeResults(results);
```

### Progress Tracking

For long-running tasks, implement progress updates:

```typescript
// In sub-agent
await sessions_send({
  sessionKey: "agent:main:main",
  message: "PROGRESS: 40% - Completed research phase"
});
```

### Context Isolation

Each sub-agent runs in isolation by default. To share context:

```typescript
// Pass specific context to sub-agent
sessions_spawn({
  task: `Context: ${relevantContext}\n\nTask: Analyze this data`,
  attachments: [
    { name: "context.md", content: sharedData }
  ]
});
```

## Best Practices

### 1. Task Decomposition

Break complex tasks into independent sub-tasks:

**Bad:**
```
"Research AI trends and write a report"
```

**Good:**
```
Sub-agent 1: "Research AI model releases in Q1 2026"
Sub-agent 2: "Research AI agent framework trends"
Sub-agent 3: "Research enterprise AI adoption stats"
Lead agent: "Synthesize findings into coherent report"
```

### 2. Parallel vs Sequential

**Parallel** (independent tasks):
- Research different topics
- Analyze separate files
- Generate multiple content pieces

**Sequential** (dependent tasks):
- Research → Analyze → Write → Review
- Each step depends on previous output

### 3. Result Aggregation

Standardize sub-agent output format:

```markdown
## Task: [task name]
## Status: complete | partial | failed
## Findings:
- Key point 1
- Key point 2

## Output Files:
- /path/to/output.md

## Confidence: high | medium | low
## Notes: [any caveats or context]
```

### 4. Error Handling

```typescript
try {
  const result = await waitForSubagent(id);
  if (result.status === 'failed') {
    // Fallback or retry logic
    console.log(`Sub-agent failed: ${result.error}`);
  }
} catch (e) {
  // Handle timeout or crash
  console.log(`Sub-agent error: ${e.message}`);
}
```

## Advanced Patterns

### Fan-Out / Fan-In

```typescript
// Fan-out: spawn multiple researchers
const researchTasks = [
  "Research market size for AI agents",
  "Research competitor products",
  "Research customer pain points",
  "Research pricing models"
];

const subagents = await Promise.all(
  researchTasks.map(task => 
    sessions_spawn({ task, label: `research-${task.split(' ')[2]}` })
  )
);

await sessions_yield(); // Wait for all to complete

// Fan-in: collect and synthesize
const results = await collectAllResults(subagents);
const synthesis = await synthesize(results);
```

### Progressive Summarization

For very long tasks, summarize intermediate results:

```typescript
// After each major milestone
const summary = await sessions_spawn({
  task: `Summarize these findings into 3-5 key points:\n\n${milestoneOutput}`,
  label: "summarizer"
});
```

### Context Compression

When context window is filling up:

```typescript
// Compress old conversation turns
const compressed = await sessions_spawn({
  task: `Compress this conversation history to 20% of original length while preserving key decisions and facts:\n\n${conversationHistory}`,
  label: "compressor"
});
```

## Integration with OpenClaw

This skill works with existing OpenClaw tools:

| Tool | Usage |
|------|-------|
| `sessions_spawn` | Create sub-agents |
| `subagents` | List/kill/steer sub-agents |
| `sessions_yield` | Wait for sub-agent completion |
| `sessions_send` | Send progress updates |
| `sessions_history` | Fetch sub-agent output |
| `process` | Manage long-running exec sessions |

## Example: Research Report Generator

```typescript
// Main agent workflow
async function generateResearchReport(topic: string) {
  // Phase 1: Parallel research
  const researchTasks = [
    `Research ${topic} - technical aspects`,
    `Research ${topic} - market trends`,
    `Research ${topic} - key players`,
    `Research ${topic} - recent news`
  ];
  
  const researchers = await Promise.all(
    researchTasks.map(task => 
      sessions_spawn({ 
        task, 
        label: `researcher-${topic.split(' ')[0]}-${Math.random().toString(36).slice(2, 5)}`,
        runtime: "subagent",
        mode: "run"
      })
    )
  );
  
  // Wait for all researchers
  await sessions_yield();
  
  // Phase 2: Collect results
  const results = [];
  for (const id of researchers) {
    const history = await sessions_history({ sessionKey: id, limit: 50 });
    results.push(extractFinalOutput(history));
  }
  
  // Phase 3: Synthesize
  const synthesis = await sessions_spawn({
    task: `Synthesize these research findings into a coherent report:\n\n${results.join('\n\n')}`,
    label: "synthesizer"
  });
  
  await sessions_yield();
  
  return getFinalResult(synthesis);
}
```

## Metrics to Track

- **Sub-agent count**: How many parallel workers
- **Completion time**: Total task duration
- **Success rate**: % of sub-agents completing successfully
- **Token efficiency**: Tokens used vs output quality
- **Context utilization**: How much context window is used

## Limitations

- Sub-agents cannot directly share memory (must pass via attachments or messages)
- Each sub-agent has independent context window
- No built-in retry logic (implement manually)
- Progress tracking requires explicit `sessions_send` calls

---

**Version:** 1.0  
**Author:** OpenClaw Community  
**Compatibility:** OpenClaw 2026.3+  
**License:** MIT
