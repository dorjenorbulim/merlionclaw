import { serve } from '@hono/node-server';
import { App } from '@slack/bolt';

// Import Slack app
import { app } from './slack/app';

// Start Slack Bolt app
const port = process.env.PORT || 3001;

console.log(`⚙️ Starting Slack Bolt app on port ${port}...`);

serve({
  fetch: app.requestHandler,
  port: Number(port),
}, (info) => {
  console.log(`✅ Slack app listening on port ${info.port}`);
});
