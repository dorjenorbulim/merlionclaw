#!/bin/bash
# Subhuti AI Coach - Quick Start Script
# Automates setup process for local development

set -e

echo "🪷 Subhuti AI Coach - Quick Start Setup"
echo "======================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check PostgreSQL
echo ""
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Installing..."
    brew install postgresql@15
    brew services start postgresql@15
else
    echo "✅ PostgreSQL: $(psql --version)"
fi

# Create database
echo ""
echo "🗄️  Setting up database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw subhuti_coach; then
    createdb subhuti_coach
    echo "✅ Database created: subhuti_coach"
else
    echo "✅ Database exists: subhuti_coach"
fi

# Enable pgvector
psql -d subhuti_coach -c "CREATE EXTENSION IF NOT EXISTS vector;" > /dev/null 2>&1 || true
echo "✅ pgvector extension enabled"

# Check Redis
echo ""
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis not found. Installing..."
    brew install redis
    brew services start redis
else
    echo "✅ Redis installed"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo ""
echo "📊 Pushing schema to database..."
npx prisma db push

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your API keys:"
    echo "   - Clerk keys (https://dashboard.clerk.com)"
    echo "   - Anthropic API key (https://console.anthropic.com)"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env.local with your API keys"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "🪷 Good luck with your MVP!"
