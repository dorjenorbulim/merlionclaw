# Subhuti AI Coach — MVP Build

**Buddhist-informed AI coaching with persistent memory**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 📁 Project Structure

```
subhuti-ai-coach/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # User dashboard
│   │   ├── admin/        # Admin dashboard
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   │   ├── ai/           # AI coaching logic
│   │   ├── db/           # Database queries
│   │   ├── memory/       # Vector memory system
│   │   └── slack/        # Slack integration
│   └── types/            # TypeScript types
├── scripts/
│   ├── db-migrate.ts     # Database migrations
│   └── db-seed.ts        # Seed data
├── docs/                 # Documentation from design phase
└── subhuti-coach-framework/  # Buddhist coaching content
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend:** Hono (Edge API)
- **AI:** Claude 3.5 Haiku (via AI SDK)
- **Database:** PostgreSQL + pgvector
- **Cache:** Redis
- **Auth:** Clerk
- **Integrations:** Slack Bolt.js, Microsoft Teams

## 📊 Core Features

- [ ] User onboarding + Buddhist methodology intro
- [ ] Daily mindfulness check-ins
- [ ] AI coaching with persistent memory
- [ ] Commitment tracking + daily nudges
- [ ] Weekly progress reports
- [ ] Slack/Teams integration
- [ ] User analytics dashboard
- [ ] Admin dashboard for HR

## 🎯 MVP Timeline

- **Week 1-2:** Setup + Auth + Database
- **Week 3-4:** AI coaching + Memory system
- **Week 5:** Slack/Teams integration
- **Week 6:** Dashboards + Testing + Beta launch

## 📈 Success Metrics

- 40% activation rate
- 25% WAU/MAU
- 35% Day-30 retention
- 20% burnout reduction
- 70% pilot-to-paid conversion

## 🔐 Environment Variables

See `.env.example` for required variables.

## 📚 Documentation

- [Architecture Spec](./docs/subhuti-ai-coach-mvp-architecture.md)
- [Feature Spec](./docs/subhuti-ai-coach-mvp-spec.md)
- [GTM Plan](./go-to-market/subhuti-ai-coach-mvp-launch-plan.md)
- [Coaching Framework](./subhuti-coach-framework/README.md)

## 🪷 The Subhuti Method

Built on three pillars:
1. **Wisdom (Paññā)** — Understanding impermanence, non-self
2. **Compassion (Karunā)** — Loving-kindness, empathetic listening
3. **Skillful Means (Upāya)** — Adapting to individual needs

---

**License:** Proprietary  
**Author:** Michael K C Lim (Subhuti AI Coach)
