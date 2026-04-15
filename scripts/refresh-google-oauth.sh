#!/bin/bash
# Google OAuth Token Refresh Script
# Run this once to refresh Drive, Calendar, and Gmail tokens
# Author: Subhuti (for Michael)
# Date: April 13, 2026

set -e

echo "🔐 Google OAuth Token Refresh"
echo "=============================="
echo ""
echo "This will refresh tokens for:"
echo "  - Google Drive (gdrive)"
echo "  - Google Calendar (gcalendar)"
echo "  - Gmail (gmail)"
echo ""
echo "Each service will open a browser window for authorization."
echo ""
read -p "Press Enter to start, or Ctrl+C to cancel..."

# Client credentials (from your existing config)
CLIENT_ID="234922258906-h156dqro4quv3cut1bajdb9q7rj9fg6b.apps.googleusercontent.com"
CLIENT_SECRET="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"

refresh_service() {
    local name=$1
    echo ""
    echo "📡 Refreshing: $name"
    echo "-------------------"
    
    # Delete existing config
    rclone config delete "$name" 2>/dev/null || true
    
    # Create new config with browser auth
    rclone config create "$name" drive \
        client_id "$CLIENT_ID" \
        client_secret "$CLIENT_SECRET" \
        token "{}" \
        2>&1 | tee /tmp/rclone-$name.log
    
    if grep -q "error" /tmp/rclone-$name.log 2>/dev/null; then
        echo "❌ Failed to refresh $name"
        return 1
    else
        echo "✅ $name refreshed successfully"
        return 0
    fi
}

# Refresh each service
echo ""
echo "🚀 Starting refresh process..."
echo ""

# Google Drive
refresh_service "gdrive"
DRIVE_RESULT=$?

# Google Calendar
refresh_service "gcalendar"
CALENDAR_RESULT=$?

# Gmail
refresh_service "gmail"
GMAIL_RESULT=$?

# Summary
echo ""
echo "=============================="
echo "📊 Refresh Summary"
echo "=============================="
echo ""

if [ $DRIVE_RESULT -eq 0 ]; then
    echo "✅ Google Drive: OK"
else
    echo "❌ Google Drive: FAILED"
fi

if [ $CALENDAR_RESULT -eq 0 ]; then
    echo "✅ Google Calendar: OK"
else
    echo "❌ Google Calendar: FAILED"
fi

if [ $GMAIL_RESULT -eq 0 ]; then
    echo "✅ Gmail: OK"
else
    echo "❌ Gmail: FAILED"
fi

echo ""

# Verify
echo "🔍 Verifying Google Drive access..."
if rclone lsd gdrive: >/dev/null 2>&1; then
    echo "✅ Drive access verified!"
else
    echo "⚠️  Drive access may need manual check"
fi

echo ""
echo "✨ Done!"
echo ""
echo "Next steps:"
echo "  1. Test: rclone lsd gdrive:"
echo "  2. If it lists folders, you're good to go!"
echo "  3. Calendar and Gmail should work automatically"
echo ""
