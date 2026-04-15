# GitHub Secrets Setup

**Purpose:** Enable automated Vercel deployments via GitHub Actions

---

## 🔐 Required Secrets

Add these 3 secrets to your GitHub repository:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VERCEL_TOKEN` | Your Vercel API token | See below |
| `VERCEL_ORG_ID` | Your Vercel organization ID | See below |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | See below |

---

## 📋 How to Get Each Secret

### 1. VERCEL_TOKEN (API Token)

**Steps:**
1. Go to https://vercel.com/account/tokens
2. Click **"Create"**
3. Name: `AgentHub-GitHub-Actions`
4. Scope: Select your account (`dorjenorbulim` or `agent-where`)
5. Click **"Create Token**"
6. **Copy the token immediately** (starts with `...`)

**Value example:** `1a2b3c4d5e6f7g8h9i0j...`

---

### 2. VERCEL_ORG_ID (Organization ID)

**Steps:**
1. Go to https://vercel.com/dashboard
2. Click on your team/org (top-left)
3. Go to **Settings** → **General**
4. Find **"Team ID"** or **"Organization ID"**

**OR run this command:**
```bash
cd /Users/subhuti/.openclaw/workspace/marketplace
vercel ls --token=<YOUR_VERCEL_TOKEN>
```

Look for: `orgId` in the output.

**Value example:** `team_ZKKvfPnXBCOp05UeDwoKTkAl`

---

### 3. VERCEL_PROJECT_ID (Project ID)

**Steps:**
1. Go to your project: https://vercel.com/dorjenorbulim/marketplace
2. Go to **Settings** → **General**
3. Find **"Project ID"**

**OR check the `.vercel/project.json` file:**
```bash
cat /Users/subhuti/.openclaw/workspace/marketplace/.vercel/project.json
```

Look for: `projectId`

**Value example:** `prj_cKEKhTtED7whRXCnDCL2uYBSwOfw`

---

## ➕ Add Secrets to GitHub

**Steps:**
1. Go to your GitHub repo: https://github.com/dorjenorbulim/merlionclaw
   - OR wherever your marketplace code is hosted
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** → **"Actions"** (left sidebar)
4. Click **"New repository secret"**
5. Add each secret:
   - Name: `VERCEL_TOKEN`
   - Value: `<paste token>`
   - Click **"Add secret"**
6. Repeat for `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

---

## ✅ Test the Workflow

**After adding secrets:**

1. **Make a small change** to any file in `marketplace/`
2. **Commit and push:**
   ```bash
   cd /Users/subhuti/.openclaw/workspace
   git add marketplace/.github/workflows/deploy.yml
   git commit -m "ci: Add GitHub Actions for Vercel deployment"
   git push origin main
   ```
3. **Go to GitHub Actions tab:**
   - https://github.com/dorjenorbulim/merlionclaw/actions
   - You should see "Deploy to Vercel" workflow running
4. **Wait 2-3 minutes** — should show green checkmark ✅

---

## 🚀 How It Works

**On every push to `main`:**
1. GitHub Actions triggers
2. Installs Vercel CLI
3. Pulls your Vercel project config
4. Builds the marketplace
5. Deploys to production
6. Comments deployment URL on commit

**On pull requests:**
- Same flow, but deploys to **preview URL** (not production)
- Great for testing before merging

---

## 📊 Workflow Status Badge

Add this to your `README.md` to show deployment status:

```markdown
![Deploy to Vercel](https://github.com/dorjenorbulim/merlionclaw/actions/workflows/deploy.yml/badge.svg)
```

---

## 🔧 Troubleshooting

### "Error: Missing VERCEL_TOKEN"
- Check secret name is exactly `VERCEL_TOKEN` (case-sensitive)
- Ensure secret is added to the correct repo

### "Error: Invalid token"
- Token expired or revoked
- Create new token at https://vercel.com/account/tokens

### "Error: Project not found"
- Wrong `VERCEL_PROJECT_ID`
- Check `.vercel/project.json` for correct ID

### Workflow doesn't trigger
- Check you pushed to `main` branch
- Check Actions aren't disabled in repo settings

---

**Created:** April 15, 2026  
**Status:** Ready for secrets configuration
