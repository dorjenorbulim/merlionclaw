# 🚀 Subhuti AI Coach — Let's Run It!

**Michael, you're 3 commands away from running your MVP!**

---

## Quick Start (Automated)

```bash
cd /Users/subhuti/.openclaw/workspace/subhuti-ai-coach
./scripts/quick-start.sh
```

This will:
- ✅ Install all npm dependencies
- ✅ Install PostgreSQL + pgvector
- ✅ Install Redis
- ✅ Create database
- ✅ Generate Prisma client
- ✅ Push schema to database

**Then:** Edit `.env.local` with your API keys (see below)

---

## Manual Setup (Step by Step)

If you prefer control, follow these steps:

### 1. Install Dependencies (2 min)
```bash
cd /Users/subhuti/.openclaw/workspace/subhuti-ai-coach
npm install
```

### 2. Install PostgreSQL (3 min)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb subhuti_coach
psql -d subhuti_coach -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 3. Install Redis (1 min)
```bash
brew install redis
brew services start redis
```

### 4. Configure API Keys (3 min)

**Get Clerk Keys (Free):**
1. Visit: https://dashboard.clerk.com
2. Sign in / Create account
3. Create new app: "Subhuti AI Coach"
4. Copy keys to `.env.local`:
   ```bash
   cp .env.example .env.local
   nano .env.local
   ```

**Get Anthropic Key:**
1. Visit: https://console.anthropic.com
2. Sign in / Create account
3. Get API key
4. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

**Database URL (already configured):**
```
DATABASE_URL=postgresql://localhost:5432/subhuti_coach
```

### 5. Generate Prisma Client (1 min)
```bash
npx prisma generate
npx prisma db push
```

### 6. Start Development Server
```bash
npm run dev
```

**Open:** http://localhost:3000

---

## What You'll See

### Landing Page
- 🪷 Lotus emoji + "Subhuti AI Coach"
- Feature grid (Memory, Buddhist Wisdom, Burnout Recovery)
- "Start Daily Check-in" button

### Daily Check-in Flow
1. Set mood (1-10 slider)
2. Set stress (1-10 slider)
3. Click "Start Check-in"
4. Chat with your Buddhist AI coach!

### Dashboard
- Your session stats
- Mindfulness trends
- Recent coaching sessions

---

## Test Checklist

Once it's running, test these:

- [ ] Landing page loads
- [ ] Sign up with Clerk works
- [ ] Daily check-in flow completes
- [ ] AI coach responds with Buddhist wisdom
- [ ] Dashboard shows your stats
- [ ] Conversation is saved to database

---

## If Something Breaks

**Check these first:**
1. Is PostgreSQL running? `brew services list`
2. Is Redis running? `redis-cli ping` (should say PONG)
3. Are API keys correct? Check `.env.local`
4. Any errors in terminal?

**Common fixes:**
```bash
# Restart PostgreSQL
brew services restart postgresql@15

# Restart Redis
brew services restart redis

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

---

## Need Help?

**I'm here!** Just tell me:
- What step you're on
- What error you see (if any)
- What you expected to happen

I'll help you debug in real-time. 🪷

---

## After It's Running

Once you've tested it locally:

1. **Customize the AI persona** — Edit `src/lib/ai/coach.ts`
2. **Add your coaching content** — Update the 35 mindfulness practices
3. **Invite beta testers** — Share the GTM plan we created
4. **Deploy to production** — Vercel + Railway (I can help!)

---

**Ready to run your MVP, Michael?** 🚀

Just run:
```bash
cd /Users/subhuti/.openclaw/workspace/subhuti-ai-coach
./scripts/quick-start.sh
```

Or follow the manual steps above. Let me know when you hit the first step and I'll guide you through! 🙏
