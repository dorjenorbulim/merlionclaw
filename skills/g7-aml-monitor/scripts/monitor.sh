#!/bin/bash
# G7 AML/CFT/Sanctions Monitor - v7 (Alternative sources)
# Uses sources without Cloudflare protection

set -e

DATE=$(date +%Y-%m-%d)
TIME=$(date '+%Y-%m-%d %H:%M SGT')
ALERT_DIR="$HOME/.openclaw/workspace/memory/g7-aml"
ALERT_FILE="$ALERT_DIR/$DATE-alert.md"
PREV_FILE="$ALERT_DIR/previous-headlines.txt"
CURR_FILE="$ALERT_DIR/current-headlines.txt"

mkdir -p "$ALERT_DIR"
touch "$PREV_FILE"
> "$CURR_FILE"

cat > "$ALERT_FILE" << EOF
# G7 AML/CFT/Sanctions Alert — $DATE

**Generated:** $TIME

---

EOF

# Use alternative sources that don't have Cloudflare

# FATF via ReliefWeb (UN aggregator, no CF)
echo "## 🌍 FATF (Financial Action Task Force)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
FATF=$(curl -s -A "Mozilla/5.0" "https://reliefweb.int/api/enewsroom/news?search=fatf+aml" 2>/dev/null | grep -oP '"title":"[^"]*"' | head -5 | sed 's/"title":"//g; s/"//g' || echo "")
if [ -n "$FATF" ]; then
  echo "$FATF" | while IFS= read -r line; do echo "- $line"; done >> "$ALERT_FILE"
else
  echo "- _Check https://www.fatf-gafi.org directly_" >> "$ALERT_FILE"
fi
echo "FATF: checked" >> "$CURR_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# FinCEN via GovInfo (official US gov, no CF)
echo "## 🇺🇸 FinCEN (US)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
FINCEN=$(curl -s -A "Mozilla/5.0" "https://www.govinfo.gov/content/pkg/FR-2026-04-07/xml/FR-2026-04-07.xml" 2>/dev/null | grep -iE "fincen|money.launder" | head -5 || echo "")
if [ -n "$FINCEN" ]; then
  echo "- Recent Federal Register entries found" >> "$ALERT_FILE"
  echo "$FINCEN" | head -3 | while IFS= read -r line; do echo "  - ${line:0:100}..."; done >> "$ALERT_FILE"
else
  echo "- _Check https://www.fincen.gov/news_" >> "$ALERT_FILE"
fi
echo "FinCEN: checked" >> "$CURR_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# OFAC via Federal Register
echo "## 🇺🇸 OFAC Sanctions (US)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
OFAC=$(curl -s -A "Mozilla/5.0" "https://www.federalregister.gov/api/v1/articles?conditions%5Bterm%5D=ofac+sanctions" 2>/dev/null | grep -oP '"title":"[^"]*"' | head -5 | sed 's/"title":"//g; s/"//g' || echo "")
if [ -n "$OFAC" ]; then
  echo "$OFAC" | while IFS= read -r line; do echo "- $line"; done >> "$ALERT_FILE"
else
  echo "- _Check https://ofac.treasury.gov/recent-actions_" >> "$ALERT_FILE"
fi
echo "OFAC: checked" >> "$CURR_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# UK via Legislation.gov.uk (official, no CF)
echo "## 🇬🇧 UK (FCA/HMT)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
UK=$(curl -s -A "Mozilla/5.0" "https://www.legislation.gov.uk/feeds/recent.xml" 2>/dev/null | grep -iE "sanction|financial" | head -5 || echo "")
if [ -n "$UK" ]; then
  echo "- Recent UK legislation found" >> "$ALERT_FILE"
else
  echo "- _Check https://www.fca.org.uk/news_" >> "$ALERT_FILE"
fi
echo "UK: checked" >> "$CURR_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# EU via EUR-Lex (official, no CF)
echo "## 🇪🇺 EU Commission (AML/CFT)" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"
EU=$(curl -s -A "Mozilla/5.0" "https://eur-lex.europa.eu/rss.do?cellar=true&type=notice&format=XML&language=en" 2>/dev/null | grep -iE "aml|sanction" | head -5 || echo "")
if [ -n "$EU" ]; then
  echo "- Recent EU regulations found" >> "$ALERT_FILE"
else
  echo "- _Check https://eur-lex.europa.eu_" >> "$ALERT_FILE"
fi
echo "EU: checked" >> "$CURR_FILE"
echo "" >> "$ALERT_FILE"
echo "---" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

# Change detection
echo "## 🆕 NEW Since Last Check" >> "$ALERT_FILE"
echo "" >> "$ALERT_FILE"

if [ -s "$PREV_FILE" ]; then
  NEW_COUNT=$(wc -l < "$CURR_FILE" | tr -d ' ')
  OLD_COUNT=$(wc -l < "$PREV_FILE" | tr -d ' ')
  if [ "$NEW_COUNT" -gt "$OLD_COUNT" ]; then
    echo "⚠️ **New regulatory activity detected**" >> "$ALERT_FILE"
    echo "" >> "$ALERT_FILE"
    echo "Review sections above for latest developments." >> "$ALERT_FILE"
  else
    echo "_No significant new changes detected_" >> "$ALERT_FILE"
  fi
else
  echo "_✓ Baseline established — future runs will detect changes_" >> "$ALERT_FILE"
fi

cp "$CURR_FILE" "$PREV_FILE"

cat >> "$ALERT_FILE" << EOF

---

**Next Steps:**
- Review sections above for new developments
- Flag urgent items for client alerts
- Update training materials if needed

**Sources:** FATF (via ReliefWeb), FinCEN (Federal Register), OFAC, UK Legislation, EUR-Lex
EOF

ln -sf "$ALERT_FILE" "$ALERT_DIR/latest-alert.md" 2>/dev/null || true

echo "✅ Alert generated: $ALERT_FILE"
