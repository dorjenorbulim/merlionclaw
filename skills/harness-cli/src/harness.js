/**
 * Harness.io API Client
 * 
 * Interact with Harness pipelines, deployments, and feature flags.
 * API Docs: https://apidocs.harness.io/
 */

class HarnessClient {
  constructor(config = {}) {
    this.accountId = config.accountId || process.env.HARNESS_ACCOUNT_ID;
    this.apiKey = config.apiKey || process.env.HARNESS_API_KEY;
    this.org = config.org || process.env.HARNESS_ORG;
    this.project = config.project || process.env.HARNESS_PROJECT;
    this.baseUrl = 'https://app.harness.io/gateway';
    
    if (!this.accountId || !this.apiKey) {
      throw new Error('Harness: accountId and apiKey are required');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Harness API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // PIPELINES

  async listPipelines() {
    const endpoint = `/pipeline/api/pipelines?accountIdentifier=${this.accountId}&orgIdentifier=${this.org}&projectIdentifier=${this.project}`;
    const response = await this.request(endpoint);
    return response.data || [];
  }

  async getPipeline(pipelineId) {
    const endpoint = `/pipeline/api/pipelines/${pipelineId}?accountIdentifier=${this.accountId}&orgIdentifier=${this.org}&projectIdentifier=${this.project}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async triggerPipeline(pipelineId, options = {}) {
    const { branch = 'main', variables = {} } = options;
    
    const endpoint = `/pipeline/api/pipelines/${pipelineId}/execution?accountIdentifier=${this.accountId}&orgIdentifier=${this.org}&projectIdentifier=${this.project}`;
    
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        branch,
        variables,
      }),
    });

    return response.data;
  }

  // EXECUTIONS

  async listExecutions(options = {}) {
    const { pipeline, status, limit = 10 } = options;
    
    const endpoint = `/pipeline/api/pipelines/execution/summary?accountIdentifier=${this.accountId}&orgIdentifier=${this.org}&projectIdentifier=${this.project}&limit=${limit}${pipeline ? `&pipelineIdentifier=${pipeline}` : ''}${status ? `&status=${status}` : ''}`;
    
    const response = await this.request(endpoint, {
      method: 'POST',
    });

    return response.data || [];
  }

  async getExecutionStatus(executionId) {
    const endpoint = `/pipeline/api/pipelines/execution/${executionId}?accountIdentifier=${this.accountId}&orgIdentifier=${this.org}&projectIdentifier=${this.project}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  // FEATURE FLAGS

  async listFeatureFlags() {
    const endpoint = `/ff/v1/accounts/${this.accountId}/orgs/${this.org}/projects/${this.project}/flags`;
    const response = await this.request(endpoint);
    return response.data || [];
  }

  async toggleFeatureFlag(flagId, enabled) {
    const endpoint = `/ff/v1/accounts/${this.accountId}/orgs/${this.org}/projects/${this.project}/flags/${flagId}/on`;
    
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });

    return response.data;
  }

  // DEPLOYMENTS

  async getDeploymentStatus(executionId) {
    // Reuse execution status for now
    return this.getExecutionStatus(executionId);
  }

  async listDeployments(options = {}) {
    const { pipeline, limit = 10 } = options;
    return this.listExecutions({ pipeline, limit });
  }
}

module.exports = HarnessClient;
