#!/bin/bash
# Google OAuth Setup Script for OpenClaw
# Run this locally to authenticate Google services

echo "🔐 Google OAuth Setup for OpenClaw"
echo "=================================="
echo ""
echo "This script will set up access to:"
echo "  - Google Calendar"
echo "  - Google Drive"
echo "  - Gmail"
echo ""
echo "You'll need to:"
echo "1. Create a project at https://console.cloud.google.com/"
echo "2. Enable APIs: Calendar, Drive, Gmail"
echo "3. Create OAuth credentials (Desktop app)"
echo "4. Run this script again with your client_id and client_secret"
echo ""

# Check if credentials provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <client_id> <client_secret>"
    echo ""
    echo "Don't have credentials yet? Follow these steps:"
    echo ""
    echo "Step 1: Go to https://console.cloud.google.com/"
    echo "Step 2: Create a new project called 'OpenClaw-Subhuti'"
    echo "Step 3: Enable these APIs:"
    echo "        - Google Calendar API"
    echo "        - Google Drive API"
    echo "        - Gmail API"
    echo "Step 4: Go to APIs & Services → Credentials → Create Credentials → OAuth client ID"
    echo "Step 5: Choose 'Desktop app' and name it 'OpenClaw'"
    echo "Step 6: Download the JSON and extract:"
    echo "        - client_id"
    echo "        - client_secret"
    echo ""
    echo "Then run: $0 YOUR_CLIENT_ID YOUR_CLIENT_SECRET"
    exit 1
fi

CLIENT_ID="$1"
CLIENT_SECRET="$2"

echo "✓ Credentials provided"
echo "  Client ID: ${CLIENT_ID:0:10}..."
echo ""

# Setup gcalcli
echo "Setting up Google Calendar..."
mkdir -p ~/.config/gcalcli

# Create gcalcli oauth file
cat > ~/.config/gcalcli/oauth_creds.json <<EOF
{
    "installed": {
        "client_id": "$CLIENT_ID",
        "client_secret": "$CLIENT_SECRET",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}
EOF

echo "✓ gcalcli configured"
echo ""
echo "Next step: Run 'gcalcli list' and complete OAuth in your browser"
echo ""
echo "After authenticating, OpenClaw will have access to:"
echo "  ✓ Read your calendar"
echo "  ✓ Create events"
echo "  ✓ Check availability"
echo ""
echo "Your credentials are stored in: ~/.config/gcalcli/"
