import { App } from '@slack/bolt';
import { runDailyCheckin, generateDailyNudge } from '@/lib/ai/coach';
import { db } from '@/lib/db';

// Initialize Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Store active sessions in memory (use Redis in production)
const activeSessions = new Map<string, string>();

// Slack command: /subhuti checkin
app.command('/subhuti', async ({ command, ack, say }) => {
  await ack();

  const userId = command.user_id;
  const text = command.text.trim();

  try {
    // Get or create user in database
    let dbUser = await db.users.findFirst({
      where: {
        integrations: {
          some: {
            platform: 'slack',
            platformUserId: userId,
          },
        },
      },
    });

    if (!dbUser) {
      await say({
        text: `🪷 Welcome to Subhuti AI Coach!

I see this is your first time. To get started, please link your Slack account:

1. Visit: https://subhuti.ai/connect
2. Sign in with your work email
3. Connect your Slack account

Once connected, you can use:
• \`/subhuti checkin\` - Start daily mindfulness check-in
• \`/subhuti nudge\` - Get a mindfulness micro-practice
• \`/subhuti status\` - View your progress this week`,
      });
      return;
    }

    // Handle commands
    if (text === 'checkin') {
      // Start daily check-in
      const { sessionId } = await runDailyCheckin(dbUser.id);
      activeSessions.set(userId, sessionId);

      await say({
        text: `🪷 Let's begin your daily mindfulness check-in.

On a scale of 1-10, how would you rate your:
• **Stress level** right now?
• **Mindfulness** today?
• **Energy** level?

Reply with your ratings (e.g., "Stress: 7, Mindfulness: 4, Energy: 6")`,
      });
    } else if (text === 'nudge') {
      // Get contextual nudge based on time of day
      const hour = new Date().getHours();
      let context: 'morning' | 'midday' | 'evening' = 'midday';
      
      if (hour < 12) context = 'morning';
      else if (hour > 18) context = 'evening';

      const nudge = await generateDailyNudge(dbUser.id, context);
      
      await say({ text: nudge });
    } else if (text === 'status') {
      // Get weekly progress
      const weeklyReport = await db.weeklyReports.findFirst({
        where: {
          userId: dbUser.id,
        },
        orderBy: {
          weekStart: 'desc',
        },
      });

      if (weeklyReport) {
        await say({
          text: `📊 **Your Week in Review**

Mindfulness Score: ${weeklyReport.mindfulnessScore}/10
Stress Score: ${weeklyReport.stressScore}/10
Coaching Sessions: ${weeklyReport.sessionsCount}
Commitments Completed: ${weeklyReport.commitmentsCompleted}

${weeklyReport.insights.length > 0 ? `**Insights:**\n${weeklyReport.insights.map(i => `• ${i}`).join('\n')}` : ''}`,
        });
      } else {
        await say({
          text: `📊 No weekly report yet. Complete your daily check-ins for a week to see your progress!`,
        });
      }
    } else {
      await say({
        text: `🪷 Subhuti AI Coach Commands:

• \`/subhuti checkin\` - Start daily mindfulness check-in
• \`/subhuti nudge\` - Get a mindfulness micro-practice
• \`/subhuti status\` - View your progress this week

Type \`/subhuti help\` for more information.`,
      });
    }
  } catch (error) {
    console.error('Error handling Slack command:', error);
    await say({
      text: 'Sorry, something went wrong. Please try again later.',
    });
  }
});

// Handle direct messages
app.message(async ({ message, say, context }) => {
  if (message.channel_type !== 'im') return; // Only respond in DMs

  const userId = message.user;
  const text = message.text;

  try {
    // Get user from database
    const dbUser = await db.users.findFirst({
      where: {
        integrations: {
          some: {
            platform: 'slack',
            platformUserId: userId,
          },
        },
      },
    });

    if (!dbUser) {
      await say({
        text: 'Please link your Slack account first by visiting: https://subhuti.ai/connect',
      });
      return;
    }

    // Check if there's an active session
    const sessionId = activeSessions.get(userId);

    if (sessionId) {
      // Continue coaching conversation
      // (In production, call sendCoachingMessage API)
      await say({
        text: `🪷 Thank you for sharing. Your AI coach will respond shortly with mindful guidance.`,
      });
    } else {
      // Start new conversation
      await say({
        text: `🪷 Hello! I'm your Subhuti AI Coach.

Type \`/subhuti checkin\` to start your daily mindfulness practice, or share what's on your mind right now.`,
      });
    }
  } catch (error) {
    console.error('Error handling Slack message:', error);
  }
});

// Slack app home tab
app.event('app_home_opened', async ({ event, say }) => {
  // Could render custom home tab with user's progress
});

export { app };
