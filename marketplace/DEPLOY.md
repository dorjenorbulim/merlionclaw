# AgentHub — Deployment Guide

**Platform:** Vercel (free tier)  
**Deploy Time:** 10 minutes  
**Cost:** $0/month (free for beta)

---

## 🚀 Quick Deploy (Command Line)

### Prerequisites
- Node.js installed (you have it — OpenClaw uses it)
- Vercel account (free, sign up at vercel.com)
- GitHub account (free)

### Deploy Steps

```bash
# 1. Navigate to marketplace folder
cd /Users/subhuti/.openclaw/workspace/marketplace

# 2. Initialize Vercel project
vercel login
vercel --init

# 3. Deploy
vercel --prod
```

### Vercel Configuration (vercel.json)

Create this file in `marketplace/` folder:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/developer-portal/?",
      "dest": "/platform/developer-portal/index.html"
    },
    {
      "src": "/customer-dashboard/?",
      "dest": "/platform/customer-dashboard/index.html"
    },
    {
      "src": "/legal/(.*)",
      "dest": "/legal/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/platform/landing-page/index.html"
    }
  ]
}
```

---

## 🌐 Alternative: Netlify (Also Free)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /Users/subhuti/.openclaw/workspace/marketplace
netlify deploy --prod --dir=.
```

---

## 📧 Alternative: GitHub Pages (Free, No CLI)

1. Create GitHub repo: `agenthub-beta`
2. Push marketplace folder to `main` branch
3. Go to Settings → Pages
4. Select `main` branch → Save
5. Site live at: `https://dorjenorbulim.github.io/agenthub-beta/`

---

## 🔗 Custom Domain (Optional, Not Required for Beta)

**For beta:** Use Vercel/Netlify subdomain (free)  
**After beta:** Buy `agenthub.io` or `agenthub.sg` (~$20/year)

**Vercel custom domain:**
1. Buy domain (Namecheap, Google Domains)
2. In Vercel: Settings → Domains → Add domain
3. Update DNS records (Vercel provides instructions)
4. SSL auto-provisioned (free)

---

## ✅ Post-Deploy Checklist

- [ ] Landing page loads
- [ ] Developer portal form works
- [ ] Customer dashboard loads
- [ ] Legal docs accessible
- [ ] All links work (test on mobile)
- [ ] Email forms open email client
- [ ] Site looks good on mobile

---

## 📊 Analytics (Optional, Free)

**Add to all HTML pages (before `</head>`):**

```html
<!-- Google Analytics (free) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Get GA_MEASUREMENT_ID:**
1. Go to analytics.google.com
2. Create property: "AgentHub"
3. Get measurement ID (starts with `G-`)
4. Add to all pages

**Alternative:** Plausible (privacy-focused, $9/month)

---

## 🎯 Beta URL (After Deploy)

**Vercel:** `https://agenthub-beta.vercel.app`  
**Netlify:** `https://agenthub-beta.netlify.app`  
**GitHub Pages:** `https://dorjenorbulim.github.io/agenthub-beta/`

**Update email templates** with actual URL before sending.

---

## 📞 If Deployment Fails

**Common issues:**
- `vercel` command not found → `npm install -g vercel`
- Login failed → `vercel logout` then `vercel login`
- Build errors → Check `vercel.json` syntax
- 404 on pages → Check route paths in `vercel.json`

**Debug:**
```bash
vercel dev  # Test locally first
vercel --debug  # See detailed logs
```

---

**Deploy now, then move to next step: Tracking Spreadsheet**
