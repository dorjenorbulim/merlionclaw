#!/bin/bash
# AgentHub Beta Deployment Script
# Run this to deploy to Vercel

set -e

echo "🚀 AgentHub Beta Deployment"
echo "============================"
echo ""

# Check if Vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to marketplace directory
cd "$(dirname "$0")"

echo "📁 Directory: $(pwd)"
echo ""

# Login to Vercel
echo "🔐 Step 1: Login to Vercel"
echo "   This will open your browser. Login with GitHub, GitLab, or email."
echo ""
read -p "Press Enter to continue..."
vercel login

echo ""
echo "✅ Logged in successfully!"
echo ""

# Deploy
echo "🚀 Step 2: Deploying to Vercel..."
echo ""
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy your deployment URL (above)"
echo "   2. Test all pages (landing, developer portal, customer dashboard)"
echo "   3. Update email templates with your deployment URL"
echo "   4. Create Google Sheet for tracking (use tracking/BETA-TRACKER.md template)"
echo "   5. Start sending recruitment emails (April 9)"
echo ""
echo "🎯 Beta launch: April 13, 2026"
echo ""
