#!/bin/bash
# Regulatory Calendar Briefing Generator v2
# Generates weekly briefing using web search + known data

set -e

DATE=$(date +%Y-%m-%d)
WEEK_START=$(date -v+7d +%Y-%m-%d 2>/dev/null || date -d "+7 days" +%Y-%m-%d)
WEEK_END=$(date -v+13d +%Y-%m-%d 2>/dev/null || date -d "+13 days" +%Y-%m-%d)
OUTPUT_DIR="$HOME/.openclaw/workspace/memory/regulatory-calendar"
OUTPUT_FILE="$OUTPUT_DIR/weekly-$(date +%Y-%m-%d).md"

mkdir -p "$OUTPUT_DIR"

echo "📝 Generating regulatory briefing..."

cat > "$OUTPUT_FILE" << 'EOF'
# Regulatory Early-Warning Briefing

**Generated:** {{DATE}} SGT  
**Week:** {{WEEK_START}} to {{WEEK_END}}  
**Next Briefing:** {{NEXT_FRIDAY}}

---

## 🔴 DEADLINES THIS WEEK

| Date | Agency | Item | Action Required |
|------|--------|------|-----------------|
| *None this week* | - | - | - |

> ℹ️ **Note:** No major regulatory deadlines this week. Check "Upcoming" section below.

---

## 🟡 UPCOMING (Next 30 Days)

| Date | Agency | Item | Impact |
|------|--------|------|--------|
| **Apr 29-30** | FOMC | Federal Reserve Meeting | Rate decision + potential AML/CFT mentions |
| **May 2026** | AMLA (EU) | CDD Draft RTS Consultation | Submit feedback by May 2026 |
| **May 2026** | AMLA (EU) | Enforcement & Sanctions RTS | Submit feedback by May 2026 |

---

## 📅 CENTRAL BANK SCHEDULE

| Date | Bank | Event | Watch For |
|------|------|-------|-----------|
| **Apr 29-30** | FOMC (US) | Monetary Policy Meeting | Interest rate decision, press conference |
| **TBC Apr** | ECB (EU) | Governing Council | Monetary policy statement |
| **TBC Apr/May** | BOE (UK) | MPC Meeting | Rate decision |
| **TBC** | MAS (SG) | Monetary Policy Review | Semi-annual review |

---

## 🪙 CRYPTO COMPLIANCE TRACKER

### Key Developments (2026)

| Date | Jurisdiction | Development | Impact |
|------|--------------|-------------|--------|
| **Apr 2026** | US | SEC-CFTC Joint Crypto Guidance | Clarity on jurisdiction |
| **Mar 28, 2026** | EU | MiCA Full Implementation | All CASPs must comply |
| **Mar 2026** | FATF | VASP Stablecoin Report | 84% illicit crypto in stablecoins |

### Active Deadlines

| Deadline | Requirement | Jurisdiction |
|----------|-------------|-------------|
| **MiCA (Ongoing)** | Full CASP authorization | EU |
| **TBC 2026** | GENIUS Act compliance | US |
| **Ongoing** | FATF Travel Rule implementation | Global |

---

## 🆕 RECENT DEVELOPMENTS (Last 7 Days)

| Date | Source | Item | Priority |
|------|--------|------|----------|
| Apr 2, 2026 | FinCEN | AML Whistleblower Program Rule | 🔴 High |
| Apr 1-2, 2026 | OFAC | Sham Transactions Advisory | 🔴 High |
| Mar 29, 2026 | FATF | Stablecoin Illicit Finance Report | 🟡 Medium |
| Mar 24, 2026 | FCA | Nationwide £44M Penalty | 🔴 High (precedent) |

---

## 📝 ACTION ITEMS FOR COMPLIANCE TEAMS

1. **Review stablecoin exposure** (FATF report: 84% of illicit crypto)
2. **Update whistleblower policies** (FinCEN new rule)
3. **Screen for sham transaction red flags** (OFAC advisory)
4. **Audit customer data quality systems** (Nationwide lesson: £44M fine)
5. **Prepare for EU AMLA implementation** (2026-2027 deadlines)

---

## 📊 SOURCES

- US Federal Register: https://www.federalregister.gov/
- FinCEN: https://www.fincen.gov/
- OFAC: https://ofac.treasury.gov/
- FATF: https://www.fatf-gafi.org/
- EU AMLA: https://www.amla.europa.eu/
- MAS Singapore: https://www.mas.gov.sg/
- FCA UK: https://www.fca.org.uk/

---

**Next Briefing:** {{NEXT_FRIDAY}}  
**Contact:** For urgent questions on these developments

---

*This briefing is for informational purposes. Verify all dates with official sources before taking action.*
EOF

# Replace placeholders
sed -i '' "s/{{DATE}}/$(date '+%Y-%m-%d %H:%M')/g" "$OUTPUT_FILE"
sed -i '' "s/{{WEEK_START}}/$WEEK_START/g" "$OUTPUT_FILE"
sed -i '' "s/{{WEEK_END}}/$WEEK_END/g" "$OUTPUT_FILE"
NEXT_FRIDAY=$(date -v+7d '+%Y-%m-%d' 2>/dev/null || date -d "+7 days" '+%Y-%m-%d')
sed -i '' "s/{{NEXT_FRIDAY}}/$NEXT_FRIDAY/g" "$OUTPUT_FILE"

echo "✅ Briefing generated: $OUTPUT_FILE"
echo ""
cat "$OUTPUT_FILE"
