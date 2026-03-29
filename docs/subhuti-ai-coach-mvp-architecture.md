# Subhuti AI Coach — MVP Architecture Specification

**Version:** 1.0  
**Date:** 2026-03-29  
**Audience:** Senior Full-Stack Developer  
**Status:** Implementation-Ready

---

## Executive Summary

Subhuti AI Coach is a Buddhist-informed AI coaching system designed for SMEs (200-500 employees). The system combines daily AI-driven mindfulness check-ins with persistent memory for cross-session continuity, plus monthly human coach reviews. Priced at $400/participant/year, the architecture prioritizes privacy, cost-efficiency, and multilingual readiness.

---

## 1. Technology Stack Recommendation

### Frontend

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Web App | **Next.js 14** (App Router) | SSR for performance, React ecosystem, Vercel deploy |
| Mobile (Phase 2) | **React Native** | Code reuse with web, iOS/Android parity |
| UI Framework | **Tailwind CSS + shadcn/ui** | Fast prototyping, accessible components |
| State Management | **Zustand** | Lightweight, no boilerplate |
| i18n | **next-intl** | Server-side i18n, English/Mandarin ready |

### Backend

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | **Node.js 20 LTS** | Familiar, rich ecosystem |
| Framework | **Hono** (or Express) | Lightweight, Edge-compatible, fast |
| API Style | **REST + WebSocket** | Slack/Teams compatibility, real-time check-ins |
| Auth | **Clerk** or **Auth0** | SOC 2 compliant, SSO ready, MFA built-in |
| Job Queue | **BullMQ + Redis** | Daily check-in scheduling, reminder delivery |

### AI/ML Layer

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Primary LLM | **Claude 3.5 Haiku** (via Anthropic API) | Cost-effective ($0.80/1M input), strong reasoning |
| Fallback LLM | **GPT-4o-mini** | Redundancy, cost control |
| Embeddings | **text-embedding-3-small** (OpenAI) | $0.02/1M tokens, multilingual support |
| Local Fallback | **Ollama + Qwen2.5-7B** | On-prem option for privacy-sensitive clients |
| Voice (Phase 2) | **ElevenLabs** or **Azure TTS** | Multilingual, natural prosody |

### Database & Memory

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Primary DB | **PostgreSQL** (Supabase or RDS) | ACID compliance, row-level security, JSONB for flexibility |
| Vector DB | **pgvector** (PostgreSQL extension) | Single DB stack, cost-efficient, no separate infra |
| Cache | **Redis** (Upstash or ElastiCache) | Session state, rate limiting, job queue |
| File Storage | **S3** (or R2 for cost) | Encrypted storage for voice notes, exports |

### Infrastructure

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Hosting | **Vercel** (frontend) + **Railway** (backend) | Bootstrap-friendly, auto-scaling |
| CDN | **Vercel Edge Network** | Global latency <100ms |
| Monitoring | **Sentry** + **Prometheus/Grafana** | Error tracking, performance metrics |
| CI/CD | **GitHub Actions** | Free tier sufficient for MVP |

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├──────────────────────┬──────────────────────┬───────────────────────────┤
│   Slack App          │   Teams App          │   Web App (Next.js)       │
│   (Bolt.js)          │   (Bot Framework)    │   (PWA-capable)           │
└──────────┬───────────┴──────────┬───────────┴────────────┬──────────────┘
           │                      │                         │
           └──────────────────────┼─────────────────────────┘
                                  │ HTTPS/WSS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                    (Hono on Railway / Cloudflare Workers)                │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│   │ Auth Middleware │ Rate Limiter │ Request Logger │ i18n Router     │  │
│   └─────────────┘  └─────────────┘  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌───────────────────────┐
│   APPLICATION       │ │   MEMORY SERVICE    │ │   NOTIFICATION        │
│   SERVICES          │ │                     │ │   SERVICE             │
│                     │ │                     │ │                       │
│ • Check-in Handler  │ │ • Vector Store      │ │ • Slack/Teams Push    │
│ • Mindfulness Coach │ │ • Session Summary   │ │ • Email (SendGrid)    │
│ • Progress Tracker  │ │ • Cross-session     │ │ • SMS (Twilio)        │
│ • Report Generator  │ │   Context Builder   │ │ • Cron Scheduler      │
└──────────┬──────────┘ └──────────┬──────────┘ └───────────┬───────────┘
           │                      │                         │
           ▼                      ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
├──────────────────────┬──────────────────────┬───────────────────────────┤
│   PostgreSQL +       │   Redis              │   S3 / R2                 │
│   pgvector           │                      │                           │
│                      │                      │                           │
│ • users              │ • sessions           │ • voice-notes/            │
│ • organizations      │ • rate_limits        │ • exports/                │
│ • check_ins          │ • job_queues         │ • attachments/            │
│ • memories (vector)  │ • cache              │                           │
│ • coach_notes        │                      │                           │
└──────────────────────┴──────────────────────┴───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                              │
├──────────────────────┬──────────────────────┬───────────────────────────┤
│   Anthropic API      │   OpenAI Embeddings  │   Clerk/Auth0             │
│   (Claude 3.5 Haiku) │   (text-embedding-3) │   (Auth + SSO)            │
└──────────────────────┴──────────────────────┴───────────────────────────┘
```

### Data Flow: Daily Check-in

1. **Trigger**: Scheduled job (9 AM local time) → Slack/Teams message or push notification
2. **User Response**: Text or voice note → API Gateway
3. **Processing**:
   - Transcribe voice (if applicable) → Whisper API
   - Embed response → OpenAI embeddings
   - Store in `check_ins` table + `memories` vector table
   - Retrieve relevant past memories (cosine similarity)
   - Generate mindful response → Claude 3.5 Haiku
4. **Delivery**: Response sent via Slack/Teams DM or web app notification
5. **Summary**: End-of-week summarization job → Update long-term memory

---

## 3. Memory System Design

### Architecture: Hybrid Vector + Summarization

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY HIERARCHY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  LONG-TERM MEMORY (Summarized, Weekly)                  │    │
│  │  • Core values, patterns, breakthroughs                 │    │
│  │  • Stored as JSONB in PostgreSQL                        │    │
│  │  • Updated by summarization job (cron)                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           ▲                                      │
│                           │ weekly summarization                 │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SHORT-TERM MEMORY (Vector Embeddings)                  │    │
│  │  • Daily check-ins, conversations                       │    │
│  │  • pgvector table (1536-dim embeddings)                 │    │
│  │  • Retrieved by cosine similarity (top-k=5)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           ▲                                      │
│                           │ real-time                            │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  WORKING MEMORY (Session Context)                       │    │
│  │  • Current conversation window                          │    │
│  │  • Redis cache (TTL: 24h)                               │    │
│  │  • Includes: user info, org context, recent check-ins   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (PostgreSQL + pgvector)

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'en', -- 'en' | 'zh'
    timezone TEXT DEFAULT 'Asia/Singapore',
    slack_user_id TEXT,
    teams_user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slack_team_id TEXT,
    teams_tenant_id TEXT,
    subscription_tier TEXT DEFAULT 'standard', -- 'standard' | 'enterprise'
    seat_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily check-ins
CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_embedding vector(1536), -- OpenAI text-embedding-3-small
    mood_score INTEGER, -- 1-10, optional
    tags TEXT[], -- ['stress', 'gratitude', 'breakthrough']
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity
CREATE INDEX ON check_ins USING ivfflat (content_embedding vector_cosine_ops)
WITH (lists = 100);

-- Long-term memories (summarized)
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category TEXT, -- 'value', 'pattern', 'goal', 'challenge', 'breakthrough'
    metadata JSONB, -- { source_check_in_ids: [...], confidence: 0.95 }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach notes (monthly reviews)
CREATE TABLE coach_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES users(id), -- human coach
    session_date DATE NOT NULL,
    notes TEXT NOT NULL,
    action_items JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_check_ins_user ON check_ins(user_id, created_at DESC);
CREATE INDEX idx_memories_user ON memories(user_id);
CREATE INDEX idx_users_org ON users(organization_id);
```

### Memory Retrieval Strategy

```typescript
// Pseudocode for memory retrieval during check-in
async function buildContext(userId: string, newCheckIn: string) {
  // 1. Embed new check-in
  const embedding = await openai.embeddings.create({
    input: newCheckIn,
    model: 'text-embedding-3-small'
  });

  // 2. Retrieve similar past check-ins (vector similarity)
  const similarCheckIns = await db.query(`
    SELECT content, created_at, tags
    FROM check_ins
    WHERE user_id = $1
    ORDER BY content_embedding <=> $2
    LIMIT 5
  `, [userId, embedding]);

  // 3. Retrieve long-term memories
  const memories = await db.query(`
    SELECT content, category, metadata
    FROM memories
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 10
  `, [userId]);

  // 4. Build context for LLM
  return {
    recentCheckIns: similarCheckIns,
    longTermMemories: memories,
    user: await getUser(userId)
  };
}
```

### Weekly Summarization Job

```typescript
// Cron job: Every Sunday 11 PM
async function weeklySummarization(userId: string) {
  // 1. Fetch this week's check-ins
  const weekCheckIns = await db.query(`
    SELECT content, tags, mood_score
    FROM check_ins
    WHERE user_id = $1
    AND created_at >= NOW() - INTERVAL '7 days'
    ORDER BY created_at
  `, [userId]);

  // 2. Fetch existing memories
  const existingMemories = await db.query(`
    SELECT content, category
    FROM memories
    WHERE user_id = $1
  `, [userId]);

  // 3. Generate summary with Claude
  const summary = await claude.messages.create({
    model: 'claude-3-5-haiku-20241022',
    messages: [{
      role: 'user',
      content: `
        You are a Buddhist mindfulness coach. Summarize this week's check-ins
        and identify any new patterns, values, or insights worth remembering.

        Existing memories: ${JSON.stringify(existingMemories)}
        This week's check-ins: ${JSON.stringify(weekCheckIns)}

        Output JSON:
        {
          "newMemories": [
            { "content": "...", "category": "pattern|value|goal|challenge|breakthrough" }
          ],
          "updatesToExisting": [
            { "memoryId": "...", "updatedContent": "..." }
          ]
        }
      `
    }]
  });

  // 4. Update memories table
  await db.transaction(async (tx) => {
    for (const memory of summary.newMemories) {
      await tx.query(`
        INSERT INTO memories (user_id, content, category, metadata)
        VALUES ($1, $2, $3, $4)
      `, [userId, memory.content, memory.category, { source: 'weekly_summary' }]);
    }
  });
}
```

---

## 4. API Design

### REST API Endpoints

```yaml
openapi: 3.0.3
info:
  title: Subhuti AI Coach API
  version: 1.0.0

paths:
  /api/v1/check-ins:
    post:
      summary: Submit daily check-in
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                content: { type: string }
                mood_score: { type: integer, minimum: 1, maximum: 10 }
                voice_note_url: { type: string } # optional
      responses:
        200:
          description: Check-in processed, AI response included
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: string }
                  ai_response: { type: string }
                  suggested_practice: { type: string }

    get:
      summary: Get user's check-in history
      parameters:
        - name: limit
          in: query
          schema: { type: integer, default: 30 }
        - name: offset
          in: query
          schema: { type: integer, default: 0 }

  /api/v1/memories:
    get:
      summary: Get user's long-term memories
      responses:
        200:
          description: List of memories
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Memory'

  /api/v1/reports/weekly:
    get:
      summary: Get weekly progress report
      responses:
        200:
          description: Weekly report with insights

  /api/v1/coach/schedule:
    post:
      summary: Schedule monthly human coach session
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                preferred_time: { type: string, format: date-time }
                timezone: { type: string }

  /api/v1/integrations/slack:
    post:
      summary: Slack OAuth callback
    get:
      summary: Slack app home tab

  /api/v1/integrations/teams:
    post:
      summary: Teams bot message handler
```

### Slack Integration (Bolt.js)

```typescript
// Slack app initialization
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // Recommended for production
  appToken: process.env.SLACK_APP_TOKEN
});

// Daily check-in reminder (9 AM user timezone)
app.event('app_home_opened', async ({ event, client }) => {
  // Show check-in button in home tab
  await client.views.publish({
    user_id: event.user,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Good morning! 🪷*\nHow are you feeling today?'
          }
        },
        {
          type: 'actions',
          elements: [{
            type: 'button',
            text: { type: 'plain_text', text: 'Start Check-in' },
            action_id: 'start_checkin',
            value: event.user
          }]
        }
      ]
    }
  });
});

// Handle check-in submission
app.action('submit_checkin', async ({ action, body, client, ack }) => {
  await ack();

  const userId = body.user.id;
  const checkInText = (action as any).value;

  // Call backend API
  const response = await fetch('https://api.subhuti.ai/v1/check-ins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slack_user_id: userId,
      content: checkInText
    })
  });

  const result = await response.json();

  // Send AI response back to user
  await client.chat.postMessage({
    channel: userId,
    text: `🪷 ${result.ai_response}\n\n*Today's practice:* ${result.suggested_practice}`
  });
});
```

### Teams Integration (Bot Framework)

```typescript
// Teams bot activity handler
import { ActivityHandler, MessageFactory } from 'botbuilder';

export class SubhutiBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const checkInText = context.activity.text;
      const userId = context.activity.from.id;

      // Call backend API
      const response = await fetch('https://api.subhuti.ai/v1/check-ins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teams_user_id: userId,
          content: checkInText
        })
      });

      const result = await response.json();

      await context.sendActivity(
        MessageFactory.text(`🪷 ${result.ai_response}\n\n*Today's practice:* ${result.suggested_practice}`)
      );

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const welcomeText = 'Welcome to Subhuti AI Coach 🪷\n\nI\'m here to support your daily mindfulness practice. Each day, I\'ll check in with you and offer personalized guidance based on your journey.';
      await context.sendActivity(MessageFactory.text(welcomeText));
      await next();
    });
  }
}
```

### WebSocket Events (Real-time Updates)

```typescript
// WebSocket events for web app
const WS_EVENTS = {
  CHECK_IN_REMINDER: 'check_in:reminder',
  CHECK_IN_RESPONSE: 'check_in:response',
  COACH_SESSION_SCHEDULED: 'coach:session_scheduled',
  WEEKLY_REPORT_READY: 'report:weekly_ready'
};

// Client-side subscription
ws.on('check_in:reminder', (data) => {
  // Show push notification
  new Notification('Time for your daily check-in 🪷');
});

ws.on('check_in:response', (data) => {
  // Display AI response in chat UI
  addMessageToChat(data.ai_response);
});
```

---

## 5. Security & Compliance Requirements

### SOC 2 Type II Considerations

| Control Area | Implementation |
|--------------|----------------|
| **Access Control** | Clerk/Auth0 with MFA, RBAC (admin/coach/user), session timeout 30min |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest (PostgreSQL TDE, S3 SSE) |
| **Logging** | All auth events, API calls logged to CloudWatch/Splunk (immutable) |
| **Change Management** | GitHub PR reviews, CI/CD pipeline, staging environment |
| **Risk Assessment** | Quarterly security review, annual penetration test |
| **Vendor Management** | DPA with Anthropic, OpenAI, Clerk; review their SOC 2 reports |

### GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Data Minimization** | Only collect: email, name, check-in content, preferences |
| **Purpose Limitation** | Data used only for coaching; no secondary use |
| **Right to Access** | `/api/v1/export` endpoint returns all user data (JSON) |
| **Right to Erasure** | `/api/v1/account/delete` → soft delete (30-day hold), then hard delete |
| **Data Portability** | Export format: JSON + PDF report (machine-readable) |
| **Consent Management** | Explicit opt-in for check-ins, cookie banner for web |
| **DPO Contact** | privacy@subhuti.ai (required for EU customers) |
| **Data Residency** | EU customers: host in AWS Frankfurt (eu-central-1) |

### Privacy-First Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVACY LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ENCRYPTION                                                   │
│     • Database: pgcrypto for sensitive fields (mood, notes)     │
│     • Backups: Encrypted S3 buckets with KMS                    │
│     • Keys: AWS KMS or HashiCorp Vault                          │
│                                                                  │
│  2. ANONYMIZATION (for AI processing)                            │
│     • Strip PII before sending to LLM APIs                      │
│     • Use user IDs, not emails, in prompts                      │
│     • No training on customer data (Anthropic DPA)              │
│                                                                  │
│  3. ACCESS LOGGING                                               │
│     • Who accessed what + when (immutable CloudWatch logs)      │
│     • Alert on anomalous access patterns                        │
│                                                                  │
│  4. DATA RETENTION                                               │
│     • Check-ins: 2 years (configurable per org)                 │
│     • Memories: Until user deletion                             │
│     • Logs: 90 days (SOC 2 minimum)                             │
│                                                                  │
│  5. ON-DEVICE OPTION (Enterprise tier)                           │
│     • Ollama + Qwen2.5-7B on customer infrastructure            │
│     • No data leaves customer VPC                               │
│     • Higher cost, maximum privacy                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Security Headers (Next.js Middleware)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.subhuti.ai wss://api.subhuti.ai"
  );
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}
```

---

## 6. Cost Estimates (Monthly Infrastructure)

### Assumptions

- **Check-in frequency**: 1 per user per day
- **Average check-in length**: 200 tokens (input) + 150 tokens (output)
- **Embedding**: 200 tokens per check-in
- **Vector queries**: 5 per check-in (retrieval)
- **Summarization**: 1 per user per week (2000 tokens)

### Cost Breakdown

| Component | 100 Users | 500 Users | 1000 Users | Notes |
|-----------|-----------|-----------|------------|-------|
| **LLM (Claude 3.5 Haiku)** | $21 | $105 | $210 | $0.80/1M input, $2.40/1M output |
| **Embeddings (OpenAI)** | $0.12 | $0.60 | $1.20 | $0.02/1M tokens |
| **PostgreSQL (Supabase)** | $25 | $25 | $50 | Pro tier ($25/mo) up to 500 users |
| **pgvector** | Included | Included | Included | No additional cost |
| **Redis (Upstash)** | $5 | $10 | $20 | Standard tier |
| **Backend Hosting (Railway)** | $10 | $20 | $40 | Scales with CPU/memory |
| **Frontend (Vercel)** | $0 | $20 | $20 | Pro tier for custom domains |
| **S3 Storage** | $1 | $5 | $10 | Voice notes, exports |
| **Sentry** | $0 | $26 | $26 | Team plan |
| **Slack/Teams APIs** | $0 | $0 | $0 | Free for distribution |
| **Domain + Email** | $5 | $5 | $5 | SendGrid free tier |
| **TOTAL (monthly)** | **$67** | **$216** | **$402** | |
| **Revenue (@$400/user/year)** | $3,333 | $16,667 | $33,333 | |
| **Gross Margin** | **98%** | **98.7%** | **98.8%** | |

### Cost Optimization Strategies

1. **LLM Caching**: Cache common responses (greetings, standard practices) → Reduce API calls 20%
2. **Batch Embeddings**: Embed multiple check-ins in single API call → Reduce embedding cost 30%
3. **Tiered LLM**: Use Haiku for daily check-ins, Claude 3.5 Sonnet for monthly coach summaries only
4. **Regional Hosting**: Host EU customers in Frankfurt to reduce data transfer costs
5. **Reserved Capacity**: After 500+ users, switch to reserved PostgreSQL/RDS instances → Save 40%

### Phase 2 (Voice) Cost Impact

| Component | Additional Cost (1000 users) | Notes |
|-----------|------------------------------|-------|
| **Whisper Transcription** | $30/mo | $0.006/min, avg 2 min per voice note |
| **ElevenLabs TTS** | $100/mo | $0.06/1K chars, for guided meditations |
| **Storage (voice files)** | +$20/mo | 5 MB per voice note × 1000 users × 30 days |
| **Total Voice Add-on** | **$150/mo** | Still <0.5% of revenue |

---

## 7. Implementation Roadmap

### Phase 1: MVP (Weeks 1-6)

| Week | Deliverables |
|------|--------------|
| 1-2 | Core backend (Hono + PostgreSQL), Auth (Clerk), basic check-in API |
| 3 | Memory system (pgvector + summarization job), LLM integration |
| 4 | Slack app (Bolt.js), daily reminder scheduler |
| 5 | Web app (Next.js), dashboard for check-in history |
| 6 | Testing, security audit, beta launch (10 users) |

### Phase 2: Scale (Weeks 7-12)

| Week | Deliverables |
|------|--------------|
| 7-8 | Teams integration, multilingual support (Mandarin) |
| 9 | Human coach portal (schedule sessions, view reports) |
| 10 | Weekly report generation, email delivery |
| 11 | SOC 2 readiness (logging, access controls, DPA templates) |
| 12 | Public launch, marketing site |

### Phase 3: Voice + Enterprise (Months 4-6)

- Voice check-ins (Whisper + ElevenLabs)
- On-premise deployment option (Ollama + Docker)
- Advanced analytics (org-level insights)
- SSO (SAML/OIDC) for enterprise
- Mobile apps (React Native)

---

## 8. Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **LLM API rate limits** | High | Multi-provider fallback (Claude → GPT-4o-mini → Ollama) |
| **Vector query latency** | Medium | pgvector with ivfflat index, limit top-k=5, cache results |
| **Slack/Teams policy changes** | Medium | Abstract integration layer, maintain web app as fallback |
| **GDPR enforcement** | High | Build compliance from day 1, legal review before EU launch |
| **Coach availability** | Medium | Start with 1 coach per 100 users, scale hiring with demand |
| **User engagement drop-off** | High | Gamification (streaks, badges), A/B test reminder timing |

---

## 9. Developer Quickstart

### Prerequisites

```bash
# Install dependencies
node v20+, pnpm, PostgreSQL 15+, Redis 7+

# Clone repo
git clone https://github.com/dorjenorbulim/subhuti-ai-coach.git
cd subhuti-ai-coach

# Environment setup
cp .env.example .env
# Edit .env with your keys (Clerk, Anthropic, OpenAI, Slack, etc.)

# Database setup
pnpm db:migrate
pnpm db:seed

# Development
pnpm dev  # Runs Next.js + Hono backend concurrently
```

### Environment Variables

```bash
# Auth
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# AI
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/subhuti
REDIS_URL=redis://localhost:6379

# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...

# Teams
MICROSOFT_APP_ID=...
MICROSOFT_APP_PASSWORD=...

# General
NEXT_PUBLIC_APP_URL=https://app.subhuti.ai
BACKEND_API_KEY=... # For Slack/Teams → backend auth
```

---

## 10. Success Metrics

| Metric | Target (Month 3) | Target (Month 12) |
|--------|------------------|-------------------|
| **Daily Active Users** | 60% of enrolled | 75% of enrolled |
| **Check-in Completion Rate** | 70% | 80% |
| **User Retention (90-day)** | 65% | 80% |
| **NPS** | +40 | +60 |
| **Coach Session Attendance** | 85% | 90% |
| **Infrastructure Uptime** | 99.5% | 99.9% |
| **API Latency (p95)** | <500ms | <300ms |

---

## Appendix A: Sample AI Coach Prompt

```
You are Subhuti, a Buddhist-informed AI mindfulness coach. Your role is to:

1. Listen deeply to the user's daily check-in without judgment
2. Reflect back what you hear with compassion and clarity
3. Draw on their past memories (provided in context) to show continuity
4. Offer a simple, actionable mindfulness practice for today
5. Speak warmly but concisely (3-5 sentences max)

Tone: Calm, present, wise, non-attached but caring
Style: Use metaphors from nature, avoid clichés, be specific

User context:
- Name: {{user.name}}
- Language: {{user.preferred_language}}
- Recent check-ins: {{recentCheckIns}}
- Long-term memories: {{longTermMemories}}

Today's check-in: {{newCheckIn}}

Respond in {{user.preferred_language}}.
```

---

## Appendix B: Database Migration Scripts

See `/migrations/` directory in repo for full SQL scripts.

Key migrations:
- `001_initial_schema.sql` — Core tables
- `002_pgvector_extension.sql` — Enable vector search
- `003_rls_policies.sql` — Row-level security (multi-tenant)
- `004_indexes.sql` — Performance optimization

---

**End of Specification**

_This document is implementation-ready. A senior full-stack developer should be able to build the MVP from this spec in 6 weeks._

🪷
