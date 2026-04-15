# harness-cli

**Description:** Interact with Harness.io CI/CD platform — manage pipelines, deployments, feature flags, and executions via API.

**Use Cases:**
- List/create/update/delete pipelines
- Trigger pipeline executions
- Monitor deployment status
- Manage feature flags
- Get artifact deployment info
- Integrate with AgentHub for automated deployments

**API Docs:** https://apidocs.harness.io/

---

## Installation

```bash
cd skills/harness-cli
# No dependencies needed — uses fetch API
```

## Configuration

Add to `TOOLS.md`:

```markdown
### Harness.io

- Account ID: `<your-account-id>`
- API Key: `<your-api-key>` (generate at https://app.harness.io/account/api-keys)
- Org: `<org-identifier>`
- Project: `<project-identifier>`
```

## Usage

### CLI Commands

```bash
# List all pipelines
npx harness-cli list-pipelines

# Get pipeline details
npx harness-cli get-pipeline <pipeline-id>

# Trigger pipeline execution
npx harness-cli trigger-pipeline <pipeline-id> --branch main

# List recent executions
npx harness-cli list-executions --pipeline <pipeline-id>

# Get deployment status
npx harness-cli get-deployment-status <execution-id>

# List feature flags
npx harness-cli list-feature-flags

# Toggle feature flag
npx harness-cli toggle-feature-flag <flag-id> --enabled
```

### Programmatic Usage

```javascript
const Harness = require('./src/harness.js');

const harness = new Harness({
  accountId: 'YOUR_ACCOUNT_ID',
  apiKey: 'YOUR_API_KEY',
  org: 'YOUR_ORG',
  project: 'YOUR_PROJECT'
});

// List pipelines
const pipelines = await harness.listPipelines();

// Trigger execution
const execution = await harness.triggerPipeline('my-pipeline', {
  branch: 'main',
  variables: { ENV: 'production' }
});

// Get status
const status = await harness.getExecutionStatus(execution.id);
```

---

## API Reference

### `listPipelines()`
Returns array of all pipelines in the project.

### `getPipeline(pipelineId)`
Returns pipeline details including YAML, stages, triggers.

### `triggerPipeline(pipelineId, options)`
Triggers a pipeline execution.
- `options.branch` — Git branch (default: main)
- `options.variables` — Pipeline variables

### `listExecutions(options)`
Returns list of pipeline executions.
- `options.pipeline` — Filter by pipeline ID
- `options.status` — Filter by status (Running, Success, Failed)
- `options.limit` — Max results (default: 10)

### `getExecutionStatus(executionId)`
Returns execution status and details.

### `listFeatureFlags()`
Returns all feature flags in the project.

### `toggleFeatureFlag(flagId, enabled)`
Enables or disables a feature flag.

---

## AgentHub Integration

Use Harness to deploy AgentHub agents automatically:

```bash
# When a developer submits an agent
npx harness-cli trigger-pipeline deploy-agent \
  --branch main \
  --variables AGENT_ID=<id>,ENV=production

# Monitor deployment
npx harness-cli get-deployment-status <execution-id>
```

**Pipeline YAML** (`.harness/pipelines/deploy-agent.yaml`):
```yaml
pipeline:
  name: Deploy Agent
  identifier: deploy-agent
  stages:
    - stage:
        name: Build
        type: CI
        spec:
          execution:
            steps:
              - step:
                  type: Run
                  name: Build Agent
                  spec:
                    command: npm run build --agent=$AGENT_ID
    - stage:
        name: Deploy
        type: Deployment
        spec:
          execution:
            steps:
              - step:
                  type: Deploy
                  name: Deploy to Vercel
                  spec:
                    command: vercel --prod
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HARNESS_ACCOUNT_ID` | Harness account ID | ✅ |
| `HARNESS_API_KEY` | API key with permissions | ✅ |
| `HARNESS_ORG` | Organization identifier | ✅ |
| `HARNESS_PROJECT` | Project identifier | ✅ |

---

## Security Notes

- **API Key Permissions:** Minimum scope: `pipelines:read`, `pipelines:execute`, `feature-flags:read`
- **Store API key in `.env`** — Never commit to git
- **Use service account** — Don't use personal API keys in production

---

**Created:** April 15, 2026  
**Author:** Michael K C Lim  
**Version:** 1.0.0
