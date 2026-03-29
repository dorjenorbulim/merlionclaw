# Subhuti AI Coach — Local Setup Guide

**Get your MVP running locally in 15 minutes**

---

## Prerequisites

Make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Homebrew (macOS) (`brew --version`)

---

## Step 1: Install Dependencies

```bash
cd /Users/subhuti/.openclaw/workspace/subhuti-ai-coach
npm install
```

**Expected output:** ~500 packages installed in 1-2 minutes

---

## Step 2: Install PostgreSQL + pgvector

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql

# Verify it's running
psql --version

# Create database
createdb subhuti_coach

# Enable pgvector extension
psql -d subhuti_coach -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Run schema migrations
psql -d subhuti_coach -f scripts/schema.sql
```

**Expected output:** 
- PostgreSQL 15.x installed
- Database created
- 10 tables created with pgvector extension

**Troubleshooting:**
- If `createdb` fails: `brew link postgresql@15 --force`
- If pgvector fails: `brew install pgvector` then restart PostgreSQL

---

## Step 3: Install Redis

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Verify it's running
redis-cli ping
```

**Expected output:** `PONG`

---

## Step 4: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your actual keys
nano .env.local
```

### Required API Keys:

**1. Clerk Authentication (Free for MVP):**
1. Go to https://dashboard.clerk.com
2. Sign up / Sign in
3. Create new application: "Subhuti AI Coach"
4. Copy keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

**2. Anthropic API (Claude):**
1. Go to https://console.anthropic.com
2. Sign up / Sign in
3. Get API key
4. Copy to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

**3. Database URL:**
```
DATABASE_URL=postgresql://localhost:5432/subhuti_coach
```

**4. Redis URL:**
```
REDIS_URL=redis://localhost:6379
```

**5. Slack (Optional for now):**
- Skip for initial testing
- Add later when ready to test Slack integration

---

## Step 5: Install Prisma + Generate Client

```bash
# Install Prisma CLI
npm install -D prisma

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

**Expected output:**
- Prisma client generated
- Database schema synced

---

## Step 6: Start Development Server

```bash
# Start Next.js app (port 3000)
npm run dev
```

**Expected output:**
```
✓ Ready in 3s
○ http://localhost:3000
```

**Open in browser:** http://localhost:3000

---

## Step 7: Test the App

### 1. Landing Page
- Visit http://localhost:3000
- You should see:
  - 🪷 Lotus emoji
  - "Subhuti AI Coach" title
  - Features section
  - "Start Daily Check-in" button

### 2. Sign In
- Click "Sign In" or go to http://localhost:3000/sign-in
- Clerk will handle authentication
- Create account with your email

### 3. Daily Check-in
- Go to http://localhost:3000/checkin
- Set mood (1-10)
- Set stress (1-10)
- Click "Start Check-in"
- Chat with your AI coach!

### 4. Dashboard
- Go to http://localhost:3000/dashboard
- View your progress stats

---

## Step 8 (Optional): Start Slack App

```bash
# In a new terminal window
npm run slack
```

**Expected output:**
```
✅ Slack app listening on port 3001
```

**Test in Slack:**
- Add bot to your Slack workspace
- Type `/subhuti checkin`
- Bot should respond with mindfulness check-in

---

## Common Issues & Solutions

### Issue: `npm install` fails
**Solution:** Delete `node_modules` and `package-lock.json`, then retry
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: PostgreSQL connection refused
**Solution:** Check if PostgreSQL is running
```bash
brew services list
brew services start postgresql@15
```

### Issue: pgvector extension not found
**Solution:** Install pgvector separately
```bash
brew install pgvector
brew services restart postgresql@15
psql -d subhuti_coach -c "CREATE EXTENSION vector;"
```

### Issue: Clerk authentication fails
**Solution:** Verify keys in `.env.local`
- Make sure you're using test keys (pk_test_..., sk_test_...)
- Restart dev server after changing env vars

### Issue: AI responses not working
**Solution:** Check Anthropic API key
- Verify key is correct in `.env.local`
- Check API key has Claude 3.5 Haiku access
- Check terminal for error messages

---

## Next Steps After Testing

1. **Customize Buddhist Content**
   - Edit `src/lib/ai/coach.ts`
   - Add your own coaching dialogues
   - Fine-tune AI persona

2. **Add More Features**
   - Weekly report generation
   - Admin dashboard for HR
   - Assessment integration

3. **Deploy to Production**
   - Vercel (frontend)
   - Railway (PostgreSQL + Redis)
   - Custom domain

---

## Support

If you get stuck:
1. Check terminal for error messages
2. Review this guide step by step
3. Ask your AI assistant (that's me!) for help

Good luck! 🪷
