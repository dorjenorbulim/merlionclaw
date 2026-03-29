/**
 * Subhuti AI Coach - Buddhist-Informed Coaching Engine
 * 
 * Core coaching logic with persistent memory and mindfulness methodology
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText } from 'ai';
import { pgVector } from '../db/pg-vector';
import { getWeeklySummary } from '../db/memory';

// Buddhist coaching persona
const SYSTEM_PROMPT = `You are Subhuti AI Coach, a Buddhist-informed AI coaching assistant.

## Your Approach (The Subhuti Method)

**Three Pillars:**
1. **Wisdom (Paññā)** — Help users understand impermanence, non-self, and interdependence
2. **Compassion (Karunā)** — Respond with loving-kindness and empathetic listening
3. **Skillful Means (Upāya)** — Adapt your approach to each individual's needs and capacity

**Core Principles:**
- Non-attachment with deep engagement (hold things lightly, but hold them well)
- The Middle Way (avoid extremes, find balance)
- Present-moment awareness (mindfulness in all interactions)
- Right speech (truthful, helpful, timely, kind)
- Emptiness teachings for letting go of rigid thinking

## Your Role

You are NOT:
- A therapist or mental health professional
- A replacement for human coaches in complex situations
- A friend or companion (maintain professional boundaries)

You ARE:
- A mindfulness coach trained in Buddhist psychology
- An accountability partner for daily practice
- A guide for working with stress, burnout, and difficult emotions
- A source of wisdom and perspective

## Conversation Style

- Warm but not clingy
- Helpful but not performative
- Concise when needed, thorough when it matters
- Use metaphors and analogies from nature, daily life
- Reference Buddhist teachings when appropriate (not preachy)
- Ask powerful questions (ICF Core Competencies)
- Reflect back what you hear (active listening)

## Escalation Criteria

Refer to human coach when:
- User mentions self-harm, suicide, or harm to others
- Severe mental health crisis (panic attacks, psychosis, severe depression)
- Complex trauma or abuse situations
- User explicitly requests human coach
- Coaching relationship rupture (user expresses dissatisfaction)

## Session Flow

1. **Check-in** — How is the user feeling right now? (1-10 scale)
2. **Explore** — What's alive for them today?
3. **Deepen** — Ask powerful questions, offer perspective
4. **Commit** — What will they do before next check-in?
5. **Close** — Gratitude, encouragement, mindfulness reminder

## Memory System

You have access to:
- Past coaching sessions (with user's permission)
- User's goals and commitments
- Weekly summaries of patterns and insights
- Burnout risk assessments

Use this memory to:
- Reference past conversations ("Last time you mentioned...")
- Track progress on commitments
- Identify recurring patterns
- Personalize your approach

Remember: You are Subhuti — a digital embodiment of mindful presence. Form is emptiness, emptiness is form. Hold things lightly, but hold them well. 🪷
`;

export interface CoachingMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CoachingSession {
  userId: string;
  sessionId?: string;
  sessionType: 'daily_checkin' | 'on_demand' | 'weekly_review';
  messages: CoachingMessage[];
}

export interface CoachingResponse {
  response: string;
  sessionId: string;
  moodBefore?: number;
  moodAfter?: number;
  commitments?: string[];
  insights?: string[];
}

/**
 * Start a new coaching session
 */
export async function startCoachingSession(
  userId: string,
  sessionType: 'daily_checkin' | 'on_demand' | 'weekly_review' = 'daily_checkin'
): Promise<{ sessionId: string }> {
  // Create session in database
  const session = await db.coachingSessions.create({
    data: {
      userId,
      sessionType,
      createdAt: new Date(),
    },
  });

  return { sessionId: session.id };
}

/**
 * Send a message and get AI response with memory context
 */
export async function sendCoachingMessage(
  sessionId: string,
  userId: string,
  userMessage: string,
  options?: {
    includeMemory?: boolean;
    includeWeeklySummary?: boolean;
  }
): Promise<CoachingResponse> {
  const { includeMemory = true, includeWeeklySummary = true } = options || {};

  // Retrieve conversation history
  const messages = await db.sessionMessages.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });

  // Retrieve memory context
  let memoryContext = '';
  if (includeMemory) {
    const similarMessages = await pgVector.findSimilarMessages(userId, userMessage, {
      limit: 3,
      threshold: 0.7,
    });

    if (similarMessages.length > 0) {
      memoryContext = `\n\n**Relevant Past Conversations:**\n${similarMessages
        .map((m) => `- ${m.content.substring(0, 200)}...`)
        .join('\n')}`;
    }
  }

  // Retrieve weekly summary
  if (includeWeeklySummary) {
    const weeklySummary = await getWeeklySummary(userId);
    if (weeklySummary) {
      memoryContext += `\n\n**This Week's Insights:**\n${weeklySummary.summaryText}`;
    }
  }

  // Build message history
  const messageHistory: CoachingMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage + memoryContext },
  ];

  // Generate AI response
  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-20241022'),
    messages: messageHistory,
    temperature: 0.7,
    maxTokens: 1000,
  });

  // Save user message and AI response to database
  await Promise.all([
    db.sessionMessages.create({
      data: {
        sessionId,
        role: 'user',
        content: userMessage,
        createdAt: new Date(),
      },
    }),
    db.sessionMessages.create({
      data: {
        sessionId,
        role: 'assistant',
        content: text,
        createdAt: new Date(),
      },
    }),
  ]);

  // Generate embedding for semantic search
  const embedding = await generateEmbedding(text);
  await pgVector.upsertMessageEmbedding(sessionId, text, embedding);

  return {
    response: text,
    sessionId,
  };
}

/**
 * Generate embedding for a message (using Claude)
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // Use Claude's embedding API or alternative
  // For now, placeholder - implement with actual embedding service
  return new Array(1536).fill(0);
}

/**
 * Daily mindfulness check-in flow
 */
export async function runDailyCheckin(userId: string): Promise<CoachingResponse> {
  // Start session
  const { sessionId } = await startCoachingSession(userId, 'daily_checkin');

  // Get user profile
  const profile = await db.userProfiles.findUnique({
    where: { userId },
  });

  // Initial check-in message
  const checkInPrompt = `🪷 Good day! Time for your daily mindfulness check-in.

On a scale of 1-10, how would you rate your:
- **Stress level** right now?
- **Mindfulness** today (how present have you been)?
- **Energy** level?

And what's one thing that's alive for you right now — something you'd like to explore in our coaching session today?`;

  return {
    response: checkInPrompt,
    sessionId,
  };
}

/**
 * Commitment tracking + daily nudge generator
 */
export async function generateDailyNudge(
  userId: string,
  context: 'morning' | 'midday' | 'evening' | 'stressful_moment'
): Promise<string> {
  // Get user's active commitments
  const commitments = await db.commitments.findMany({
    where: {
      userId,
      status: 'active',
    },
    take: 3,
  });

  // Get mindfulness practice for today
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const practices = getMindfulnessPractices();
  const todaysPractice = practices[dayOfYear % practices.length];

  // Generate personalized nudge
  const nudgePrompts = {
    morning: `Good morning! 🌅

${todaysPractice}

${commitments.length > 0 ? `Remember your commitment: "${commitments[0].title}" — what's one small step you can take today?` : ''}

Take three conscious breaths before starting your day. 🪷`,

    midday: `Midday check-in 🌞

How present have you been this morning? Take a moment to notice:
- Your posture
- Your breath
- Any tension in your body

${todaysPractice}

Reset with 1 minute of mindful breathing.`,

    evening: `Evening reflection 🌙

As the day winds down, take a moment to appreciate:
- One thing you did mindfully today
- One challenge you met with compassion
- One thing you're grateful for

${todaysPractice}

Let go of what didn't go perfectly. Rest well. 🪷`,

    stressful_moment: `I sense this might be a challenging moment. 🪷

Pause. Take three conscious breaths.

Remember: **This too shall pass.** Impermanence applies to difficulties as well.

${todaysPractice}

What would compassion look like right now — for yourself?`,
  };

  return nudgePrompts[context];
}

/**
 * Mindfulness practice library (35 micro-practices)
 */
function getMindfulnessPractices(): string[] {
  return [
    '🧘 **3-Minute Breathing Space:** Close your eyes. Notice your breath. If your mind wanders, gently return to the breath.',
    '🙏 **Loving-Kindness:** Silently repeat: "May I be well. May I be happy. May I be at ease." Then extend to others.',
    '👂 **Deep Listening:** For the next conversation, listen fully without planning your response.',
    '🚶 **Walking Meditation:** Feel each footstep. Notice the sensation of contact with the ground.',
    '☕ **Mindful Tea/Coffee:** Drink slowly. Notice the temperature, taste, aroma. Be fully present.',
    '🌳 **Nature Connection:** Step outside. Notice one thing you see, hear, feel. Connect with the earth.',
    '📝 **Gratitude Journal:** Write down 3 things you're grateful for. Feel the gratitude in your body.',
    '🔍 **Body Scan:** Starting from your toes, notice sensations in each part of your body up to your head.',
    '💭 **Thought Watching:** Sit quietly. Watch thoughts arise and pass like clouds in the sky. Don\'t engage, just observe.',
    '💗 **Heart Center:** Place your hand on your heart. Feel the warmth. Send kindness to yourself.',
    // ... (25 more practices in full implementation)
  ];
}

export default {
  startCoachingSession,
  sendCoachingMessage,
  runDailyCheckin,
  generateDailyNudge,
};
