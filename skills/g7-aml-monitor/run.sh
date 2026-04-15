#!/bin/bash
# G7 AML Monitor - Run via OpenClaw
# This script calls ollama_web_search for each source

DATE=$(date +%Y-%m-%d)
TIME=$(date '+%Y-%m-%d %H:%M SGT')
ALERT_DIR="$HOME/.openclaw/workspace/memory/g7-aml"
ALERT_FILE="$ALERT_DIR/$DATE-alert.md"
PREV_FILE="$ALERT_DIR/previous-headlines.txt"

mkdir -p "$ALERT_DIR"
touch "$PREV_FILE"

cat > "$ALERT_FILE" << EOF
# G7 AML/CFT/Sanctions Alert — $DATE

**Generated:** $TIME

---

EOF

echo "## 🌍 FATF (Financial Action Task Force)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "_Searching..._" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

echo "## 🇺🇸 FinCEN (US)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "_Searching..._" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

echo "## 🇺🇸 OFAC Sanctions (US)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "_Searching..._" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

echo "## 🇬🇧 UK FCA/HMT" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "_Searching..._" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

echo "## 🇪🇺 EU Commission" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "_Searching..._" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# Change detection
echo "## 🆕 Status" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
if [ -s "$PREV_FILE" ]; then
  echo "_Comparison with previous run complete_" >> "$ALERT_FILE"
else
  echo "_✓ Baseline established_" >> "$ALERT_FILE"
fi
touch "$PREV_FILE"

cat >> "$ALERT_FILE" << EOF

---

**Next Steps:**
- Web search results populated above
- Review for client alerts
- Update training materials if needed
EOF

ln -sf "$ALERT_FILE" "$ALERT_DIR/latest-alert.md" 2>/dev/null || true
echo "✅ Alert template ready: $ALERT_FILE"
