#!/bin/bash
# Claude Code ↔ OpenClaw Integration Setup

echo "🦌 Setting up Claude Code ↔ OpenClaw Integration..."

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Installing..."
    npm install -g @anthropic-ai/claude-code
fi

# Create skills directory if it doesn't exist
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$CLAUDE_SKILLS_DIR"

# Copy skill to Claude Code directory
echo "📦 Installing skill to Claude Code..."
cp -r "$(dirname "$0")" "$CLAUDE_SKILLS_DIR/claude-to-openclaw"

# Make executable
chmod +x "$CLAUDE_SKILLS_DIR/claude-to-openclaw/claude-to-openclaw.js"

# Check if OpenClaw is running
if ! curl -s http://localhost:18789/api/health > /dev/null 2>&1; then
    echo "⚠️  OpenClaw doesn't appear to be running."
    echo "   Start it with: openclaw start"
else
    echo "✅ OpenClaw is running"
fi

# Test the integration
echo ""
echo "🧪 Testing integration..."
node "$CLAUDE_SKILLS_DIR/claude-to-openclaw/claude-to-openclaw.js" status

echo ""
echo "✅ Setup complete!"
echo ""
echo "Usage in Claude Code:"
echo "  /claude-to-openclaw send <message>"
echo "  /claude-to-openclaw status"
echo "  /claude-to-openclaw models"
echo "  /claude-to-openclaw help"
echo ""
echo "Or from terminal:"
echo "  node skills/claude-to-openclaw/claude-to-openclaw.js <command>"
