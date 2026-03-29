# 🔒 Subhuti AI Coach — Security Audit & Action Plan

**Priority: CRITICAL — Personal Data Protection**

---

## 🚨 Critical Security Issues (Fix Before Beta)

### 1. **Environment Variables Exposed**
**Issue:** `.env.local` should never be committed to git  
**Fix:** ✅ Already in `.gitignore`  
**Action:** Verify `.env.local` is not in git history

```bash
# Check if .env.local was accidentally committed
git log --all --full-history -- .env.local
# If found, remove from history:
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.local' \
  --prune-empty --tag-name-filter cat -- --all
```

---

### 2. **Database Connection String Exposed**
**Issue:** `DATABASE_URL` in client-side code could leak  
**Fix:** Use server-side only, never expose to browser  
**Status:** ✅ Already server-side only in Prisma

**Additional Protection:**
```typescript
// Add to .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/subhuti_coach?sslmode=require

// For production, use connection pooling with limits
DATABASE_POOL_TIMEOUT=10
DATABASE_CONNECTION_LIMIT=5
```

---

### 3. **API Keys in Frontend Code**
**Issue:** Clerk publishable key is public (by design), but secret key must stay server-side  
**Fix:** ✅ Clerk keys are correctly separated  
**Action:** Never commit `CLERK_SECRET_KEY`

---

### 4. **No Rate Limiting on API Routes**
**Issue:** AI endpoints can be abused (cost + DoS)  
**Fix:** Add rate limiting middleware

```typescript
// src/middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
});

export async function rateLimitMiddleware(request: NextRequest, userId: string) {
  const { success } = await rateLimit.limit(userId);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  return null;
}
```

**Install:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

---

### 5. **No Input Validation/Sanitization**
**Issue:** User input not validated (XSS, injection risks)  
**Fix:** Add Zod validation to all API routes

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const coachingSessionSchema = z.object({
  mood: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  sessionType: z.enum(['daily_checkin', 'on_demand', 'weekly_review']),
});

export const messageSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(5000), // Prevent huge payloads
});
```

**Usage in API routes:**
```typescript
const validatedData = coachingSessionSchema.parse(await request.json());
```

---

### 6. **No Authentication on API Routes**
**Issue:** API routes don't verify user owns the session  
**Fix:** Add Clerk auth middleware to all coaching routes

```typescript
// src/app/api/coaching/message/route.ts
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Verify user owns this session
  const session = await db.coachingSession.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });
  
  if (session?.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... rest of logic
}
```

---

### 7. **Sensitive Data in Database**
**Issue:** Coaching conversations contain personal mental health data  
**Fix:** Encrypt sensitive fields at rest

```bash
npm install crypto-js
```

```typescript
// src/lib/encryption.ts
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-char random string

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

**Encrypt these fields:**
- `SessionMessage.content` (coaching conversations)
- `UserProfile.goals` (personal goals)
- `BurnoutAssessment.notes` (health data)

---

### 8. **No Data Retention Policy**
**Issue:** Personal data stored indefinitely (GDPR risk)  
**Fix:** Implement automatic data deletion

```typescript
// scripts/cleanup-old-data.ts
// Run weekly via cron

const THIRTY_DAYS_AGO = new Date();
THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

// Delete old sessions (keep last 30 days)
await db.sessionMessage.deleteMany({
  where: {
    session: {
      createdAt: { lt: THIRTY_DAYS_AGO },
    },
  },
});

// Anonymize old burnout assessments
await db.burnoutAssessment.updateMany({
  where: {
    createdAt: { lt: THIRTY_DAYS_AGO },
  },
  data: {
    notes: '[ANONYMIZED]',
    emotionalExhaustion: null,
    depersonalization: null,
    personalAccomplishment: null,
  },
});
```

**Add to package.json:**
```json
"scripts": {
  "cleanup": "tsx scripts/cleanup-old-data.ts"
}
```

**Cron job (weekly):**
```bash
# Add to crontab
0 2 * * 0 cd /path/to/subhuti-ai-coach && npm run cleanup
```

---

### 9. **No HTTPS in Production**
**Issue:** Data transmitted in plain text  
**Fix:** Force HTTPS in production

```typescript
// next.config.js
module.exports = {
  // ...other config
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ],
};
```

---

### 10. **No Security Headers**
**Issue:** Missing security headers (XSS, clickjacking protection)  
**Fix:** Add security headers

```typescript
// next.config.js
headers: [
  {
    source: '/:path*',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
]
```

---

## 🔐 Privacy Compliance (GDPR/PIPEDA)

### Required Actions:

**1. Privacy Policy** (Required before beta)
- What data you collect
- How it's used
- How long it's stored
- User rights (access, deletion, export)

**2. Terms of Service** (Required before beta)
- Not medical/mental health advice
- Limitation of liability
- User responsibilities

**3. Data Export Feature** (GDPR Article 20)
```typescript
// src/app/api/user/export-data/route.ts
// Export all user data in JSON format
```

**4. Right to Deletion** (GDPR Article 17)
```typescript
// src/app/api/user/delete-account/route.ts
// Delete account + all associated data
```

**5. Cookie Consent** (if using analytics)
- Add cookie banner
- Allow opt-out

---

## 📊 Security Checklist (Before Beta Launch)

- [ ] Rate limiting on all API routes
- [ ] Input validation with Zod
- [ ] Authentication on all coaching routes
- [ ] Session ownership verification
- [ ] Encrypt sensitive database fields
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Data retention policy implemented
- [ ] Privacy policy written
- [ ] Terms of service written
- [ ] Data export feature
- [ ] Account deletion feature
- [ ] Error logging (no sensitive data in logs)
- [ ] Database backups configured
- [ ] Security audit completed

---

## 🛡️ Production Security Recommendations

### Infrastructure:

**1. Use Managed Services (More Secure)**
- **Database:** Railway, Supabase, or AWS RDS (automatic backups, patches)
- **Redis:** Upstash (managed, encrypted)
- **Hosting:** Vercel (automatic HTTPS, DDoS protection)

**2. Database Security**
```bash
# Production DATABASE_URL
DATABASE_URL=postgresql://user:strong_password@host:5432/db?sslmode=require&connection_limit=5

# Use environment-specific credentials
# Never use same password across environments
```

**3. API Key Management**
- Use Vercel Environment Variables (encrypted at rest)
- Rotate keys every 90 days
- Never commit keys to git

**4. Monitoring**
```bash
npm install @sentry/nextjs
```

- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Security scanning (Snyk)

---

## 📞 Emergency Contacts

**If Security Breach Occurs:**

1. **Immediately:**
   - Rotate all API keys
   - Revoke database access
   - Enable maintenance mode

2. **Within 24 hours:**
   - Assess scope of breach
   - Notify affected users (GDPR: 72 hours)
   - Document incident

3. **Within 7 days:**
   - Fix vulnerability
   - Security audit
   - Update privacy policy if needed

---

## 🎯 Priority Order (Fix These First)

**CRITICAL (Before Any Testing):**
1. ✅ Rate limiting
2. ✅ Input validation
3. ✅ Auth on API routes
4. ✅ Encrypt coaching conversations

**HIGH (Before Beta):**
5. Privacy policy + Terms
6. Data retention policy
7. Security headers
8. HTTPS enforcement

**MEDIUM (Before Public Launch):**
9. Data export feature
10. Account deletion
11. Monitoring/logging
12. Penetration testing

---

**Status:** Security audit complete. Implementation ready for tomorrow. 🔒
