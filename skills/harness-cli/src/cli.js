#!/usr/bin/env node

/**
 * Harness CLI - Command Line Interface
 * 
 * Usage:
 *   npx harness-cli list-pipelines
 *   npx harness-cli get-pipeline <id>
 *   npx harness-cli trigger-pipeline <id> --branch main
 *   npx harness-cli list-executions --pipeline <id>
 *   npx harness-cli get-deployment-status <execution-id>
 */

const HarnessClient = require('./harness.js');

const args = process.argv.slice(2);
const command = args[0];

function printUsage() {
  console.log(`
Harness CLI - Manage pipelines and deployments

Usage:
  npx harness-cli <command> [options]

Commands:
  list-pipelines                    List all pipelines
  get-pipeline <id>                 Get pipeline details
  trigger-pipeline <id> [options]   Trigger pipeline execution
  list-executions [options]         List recent executions
  get-deployment-status <id>        Get deployment status
  list-feature-flags                List feature flags
  toggle-feature-flag <id>          Toggle feature flag

Options:
  --branch <branch>                 Git branch (default: main)
  --var <KEY=VALUE>                 Pipeline variable (can repeat)
  --pipeline <id>                   Filter by pipeline
  --status <status>                 Filter by status
  --limit <n>                       Max results (default: 10)
  --enabled / --disabled            Toggle flag state
  --help                            Show this help

Examples:
  npx harness-cli list-pipelines
  npx harness-cli get-pipeline my-pipeline
  npx harness-cli trigger-pipeline deploy-agent --branch main --var ENV=prod
  npx harness-cli list-executions --pipeline my-pipeline --limit 5
  npx harness-cli toggle-feature-flag new-ui --enabled
`);
}

async function main() {
  if (!command || command === '--help') {
    printUsage();
    process.exit(0);
  }

  let harness;
  try {
    harness = new HarnessClient();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    console.error('\nSet environment variables:');
    console.error('  HARNESS_ACCOUNT_ID=<your-account-id>');
    console.error('  HARNESS_API_KEY=<your-api-key>');
    console.error('  HARNESS_ORG=<your-org>');
    console.error('  HARNESS_PROJECT=<your-project>');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'list-pipelines': {
        const pipelines = await harness.listPipelines();
        console.log(`\n📋 Pipelines (${pipelines.length}):\n`);
        pipelines.forEach(p => {
          console.log(`  • ${p.identifier} — ${p.name}`);
        });
        break;
      }

      case 'get-pipeline': {
        const pipelineId = args[1];
        if (!pipelineId) {
          console.error('❌ Pipeline ID required');
          process.exit(1);
        }
        const pipeline = await harness.getPipeline(pipelineId);
        console.log('\n📋 Pipeline Details:\n');
        console.log(`  Name: ${pipeline.name}`);
        console.log(`  ID: ${pipeline.identifier}`);
        console.log(`  Created: ${new Date(pipeline.createdAt).toLocaleString()}`);
        console.log(`  Updated: ${new Date(pipeline.lastModifiedAt).toLocaleString()}`);
        break;
      }

      case 'trigger-pipeline': {
        const pipelineId = args[1];
        if (!pipelineId) {
          console.error('❌ Pipeline ID required');
          process.exit(1);
        }

        const branchIdx = args.indexOf('--branch');
        const branch = branchIdx >= 0 ? args[branchIdx + 1] : 'main';

        const variables = {};
        const varIndices = args.reduce((acc, arg, i) => {
          if (arg === '--var') acc.push(i);
          return acc;
        }, []);
        varIndices.forEach(i => {
          const [key, value] = args[i + 1].split('=');
          variables[key] = value;
        });

        console.log(`\n🚀 Triggering pipeline: ${pipelineId}`);
        console.log(`   Branch: ${branch}`);
        if (Object.keys(variables).length > 0) {
          console.log(`   Variables: ${JSON.stringify(variables)}`);
        }

        const execution = await harness.triggerPipeline(pipelineId, { branch, variables });
        console.log(`\n✅ Execution started: ${execution.identifier}`);
        console.log(`   Status: ${execution.status}`);
        console.log(`   URL: https://app.harness.io/ng/#/${harness.accountId}/cd/orgs/${harness.org}/projects/${harness.project}/pipelines/${pipelineId}/executions/${execution.identifier}`);
        break;
      }

      case 'list-executions': {
        const pipelineIdx = args.indexOf('--pipeline');
        const pipeline = pipelineIdx >= 0 ? args[pipelineIdx + 1] : null;

        const statusIdx = args.indexOf('--status');
        const status = statusIdx >= 0 ? args[statusIdx + 1] : null;

        const limitIdx = args.indexOf('--limit');
        const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10;

        const executions = await harness.listExecutions({ pipeline, status, limit });
        console.log(`\n⚡ Executions (${executions.length}):\n`);
        executions.forEach(e => {
          const icon = e.status === 'Success' ? '✅' : e.status === 'Failed' ? '❌' : '⏳';
          console.log(`  ${icon} ${e.identifier} — ${e.status} (${new Date(e.lastUpdatedAt).toLocaleString()})`);
        });
        break;
      }

      case 'get-deployment-status': {
        const executionId = args[1];
        if (!executionId) {
          console.error('❌ Execution ID required');
          process.exit(1);
        }
        const status = await harness.getExecutionStatus(executionId);
        console.log('\n📊 Deployment Status:\n');
        console.log(`  Execution: ${status.identifier}`);
        console.log(`  Status: ${status.status}`);
        console.log(`  Started: ${new Date(status.startedAt).toLocaleString()}`);
        if (status.lastUpdatedAt) {
          console.log(`  Updated: ${new Date(status.lastUpdatedAt).toLocaleString()}`);
        }
        break;
      }

      case 'list-feature-flags': {
        const flags = await harness.listFeatureFlags();
        console.log(`\n🚩 Feature Flags (${flags.length}):\n`);
        flags.forEach(f => {
          const status = f.enabled ? '✅ ON' : '❌ OFF';
          console.log(`  ${status} ${f.identifier} — ${f.name}`);
        });
        break;
      }

      case 'toggle-feature-flag': {
        const flagId = args[1];
        if (!flagId) {
          console.error('❌ Flag ID required');
          process.exit(1);
        }

        const enabled = args.includes('--enabled') && !args.includes('--disabled');
        const disabled = args.includes('--disabled');
        
        if (enabled === disabled) {
          console.error('❌ Specify --enabled or --disabled');
          process.exit(1);
        }

        console.log(`\n🚩 Toggling flag: ${flagId}`);
        console.log(`   New state: ${enabled ? 'ENABLED' : 'DISABLED'}`);

        await harness.toggleFeatureFlag(flagId, enabled);
        console.log(`✅ Flag updated`);
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
}

main();
