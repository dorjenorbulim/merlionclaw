# G7 AML/CFT/Sanctions Monitor

**Purpose:** Autonomous monitoring of AML/CFT/sanctions regulatory changes across G7 nations

**Sources:** FATF, FinCEN, OFAC, FCA (UK), EU Commission, BaFin (Germany), FINTRAC (Canada), JFSA (Japan)

**Output:** Daily digest stored in `memory/g7-aml/YYYY-MM-DD-alert.md`

---

## How It Works

1. **Search** — Uses web search to find latest regulatory updates
2. **Compare** — Checks against previous day's headlines
3. **Alert** — Flags NEW items with ⚠️
4. **Store** — Saves to memory for tracking

---

## Usage

```bash
# Run the monitor
openclaw run g7-aml-monitor

# View latest alert
cat memory/g7-aml/latest-alert.md

# View history
ls -la memory/g7-aml/
```

---

## Cron Schedule

Runs daily at 8:00 AM SGT.

To set up:
```bash
openclaw cron add --name "G7 AML Monitor" --schedule "0 8 * * *" --command "openclaw run g7-aml-monitor"
```

---

## Revenue Model

| Tier | Price | Sources | Delivery |
|------|-------|---------|----------|
| **Solo** | $500/mo | FATF + OFAC + FinCEN | Email digest |
| **Team** | $2K/mo | All G7 sources | Slack/Telegram + API |
| **Enterprise** | $5K/mo | Custom sources + API | White-label |

---

## Files

- `scripts/monitor.sh` — Main monitoring script
- `memory/g7-aml/` — Alert storage
- `memory/g7-aml/previous-headlines.txt` — Baseline for change detection
