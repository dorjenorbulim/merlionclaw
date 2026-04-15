# G7 AML/CFT/Sanctions Monitor

**Status:** MVP Complete ✅  
**Next:** Set up daily cron at 8 AM SGT

---

## What's Built

1. **Skill structure** — `skills/g7-aml-monitor/`
2. **Alert storage** — `memory/g7-aml/YYYY-MM-DD-alert.md`
3. **Change tracking** — Compares daily for new activity
4. **Latest symlink** — `memory/g7-aml/latest-alert.md`

---

## Current Limitation

Direct RSS feeds from FATF, FCA, etc. are blocked by Cloudflare. 

**Solution:** Use OpenClaw's `ollama_web_search` tool via a proper skill definition. This requires the skill to be registered and run through OpenClaw's tool system.

---

## Next Steps

1. Register the skill with OpenClaw
2. Create the skill runner that calls `ollama_web_search`
3. Set up cron: `openclaw cron add --schedule "0 8 * * *" --command "openclaw run g7-aml-monitor"`
4. Test first automated run

---

## Alternative: Manual Daily Check

Until the skill is fully automated, you can run:

```bash
# Quick web search for each source
openclaw web-search "FATF AML news April 2026"
openclaw web-search "FinCEN advisory 2026"
openclaw web-search "OFAC sanctions 2026"
```

Results get stored in `memory/g7-aml/` for tracking.

---

## Revenue Model (Unchanged)

| Tier | Price | Sources | Delivery |
|------|-------|---------|----------|
| **Solo** | $500/mo | FATF + OFAC + FinCEN | Email digest |
| **Team** | $2K/mo | All G7 sources | Slack/Telegram + API |
| **Enterprise** | $5K/mo | Custom + API | White-label |

---

**Files Created:**
- `skills/g7-aml-monitor/SKILL.md`
- `skills/g7-aml-monitor/scripts/monitor.sh`
- `skills/g7-aml-monitor/index.js`
- `skills/g7-aml-monitor/README.md`
- `memory/g7-aml/2026-04-07-alert.md`
