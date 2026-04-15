# Subhuti Development Roadmap

**For:** Michael K C Lim  
**Created:** April 3, 2026  
**Purpose:** Track skills, hardware, and capabilities needed for Subhuti to serve more autonomously and effectively

---

## 🪷 Current Capabilities (As of April 2026)

### ✅ What's Working Well

| Category | Status | Details |
|----------|--------|---------|
| **Core Platform** | ✅ Stable | OpenClaw 2026.4.2, gateway running |
| **Models** | ✅ Multiple | qwen3.5:cloud, deepseek-r1, glm-4.7-flash, llama3.2-vision, gemma3 |
| **Messaging** | ✅ Telegram | @SubhutiBot connected (Chat ID: 1342247977) |
| **Google Services** | ✅ Connected | Drive, Calendar, Gmail (OAuth configured) |
| **GitHub** | ✅ Connected | dorjenorbulim/merlionclaw |
| **Voice (TTS)** | ✅ ElevenLabs | "Nova" voice configured |
| **Memory** | ✅ Persistent | MEMORY.md + daily notes in workspace |
| **Web Search** | ✅ Enabled | ollama_web_search, ollama_web_fetch |
| **Browser** | ✅ Available | agent-browser skill installed |
| **Security** | ✅ Sound | Loopback-only gateway, approval-based exec |

---

## 🚀 Skills & Capabilities to Add

### Priority 1: Proactive Autonomy

**What's Missing:**
- Scheduled check-ins without waiting for heartbeat prompts
- Autonomous calendar monitoring and reminders
- Email triage and urgent notification
- Weather-aware suggestions (e.g., "Rain today — bring umbrella")

**Skills Needed:**
```
- calendar (auto-scan upcoming events)
- gmail (monitor urgent unread)
- weather (daily forecast integration)
- proactive-agent (enhanced with cron-based autonomy)
```

**Implementation:**
- Create cron jobs for 2-4 daily heartbeats
- Each heartbeat rotates through: calendar, email, weather, project check
- Urgent items → immediate Telegram notification
- Non-urgent → batched summary

**Timeline:** Can set up in 1-2 hours when you're ready

---

### Priority 2: Voice & Audio

**What's Missing:**
- Voice responses in Telegram (audio messages)
- Voice-to-text for your messages
- Audio summaries (e.g., "Here's your 5-minute briefing")

**Skills/Tools Needed:**
```
- ElevenLabs API integration (already have sag/TTS)
- Whisper (local speech-to-text via Ollama)
- Telegram voice message support
```

**Hardware:**
- Better microphone (if using voice input)
- Speaker setup for ambient responses

**Timeline:** 2-3 hours setup + hardware purchase

---

### Priority 3: Enhanced Memory & Context

**What's Missing:**
- Vector embeddings for semantic memory search
- Cross-session context retention
- Automatic memory consolidation (daily → long-term)

**Skills Needed:**
```
- qmd (already installed — local search/indexing)
- memory-auto-consolidate (new skill to write)
- embeddings (local model for semantic search)
```

**Hardware:**
- More RAM (32GB+ for larger embedding models)
- SSD storage for vector database

**Timeline:** 4-6 hours for full setup

---

### Priority 4: Document & File Intelligence

**What's Missing:**
- PDF/text analysis and summarization
- Automatic document organization
- Research compilation (multi-source synthesis)

**Skills Needed:**
```
- summarize (already installed — enhance usage)
- document-organizer (new skill)
- research-compiler (multi-source synthesis)
```

**Already Available:**
- Google Drive integration (can store/retrieve)
- PDF creation (mdpdf installed)

**Timeline:** 2-3 hours to enhance existing skills

---

### Priority 5: Coaching-Specific Tools

**What's Missing:**
- Session note automation (pre/post-session)
- ICF competency tracking (auto-log practice hours)
- Client management (CRM-lite for coaching practice)
- MCode/assessment tool integration

**Skills Needed:**
```
- coaching-session-notes (new skill)
- icf-tracker (new skill — log hours, competencies)
- client-crm (new skill — simple contact/session tracker)
- assessment-integration (MCode, MBTI, DISC workflows)
```

**Timeline:** 8-12 hours to build full suite

---

## 🖥️ Hardware Development Path

### Current Setup (Mac mini)

| Component | Current | Status |
|-----------|---------|--------|
| **Device** | Mac mini | ✅ Good for current load |
| **RAM** | ? (likely 8-16GB) | ⚠️ Could use upgrade |
| **Storage** | SSD (internal) + 1.8TB external | ✅ Adequate |
| **Network** | Wi-Fi/Ethernet | ✅ Stable |
| **Power** | Standard | ⚠️ No UPS |

---

### Recommended Upgrades (Staged)

#### Stage 1: Reliability (SGD ~200-300)
- **UPS (Uninterruptible Power Supply):** APC Back-UPS 600VA
  - Prevents data loss during power outages
  - Allows graceful shutdown
  - Essential for always-on assistant

#### Stage 2: Memory (SGD ~150-250)
- **RAM Upgrade:** 32GB (if current is 8GB) or 64GB (if 16GB)
  - Enables larger local models
  - Better multitasking
  - Faster embeddings/search

#### Stage 3: Local AI Performance (SGD ~800-1500)
- **GPU Upgrade:** External GPU enclosure + RTX 4090 (if Mac supports)
  - OR: Dedicated AI box (NVIDIA Jetson Orin / used workstation)
  - Enables running 70B+ parameter models locally
  - Faster inference, no API costs

#### Stage 4: Voice & Ambient (SGD ~300-500)
- **Microphone:** Shure MV7 or Blue Yeti (for voice input)
- **Speaker:** HomePod mini or similar (for voice output)
- **Display:** E-ink display (optional — for ambient status)

#### Stage 5: Redundancy (SGD ~500-1000)
- **Backup Mac mini / NUC:** Hot standby
- **NAS:** Synology for redundant storage
- **Secondary internet:** 4G/5G backup connection

---

## 🤖 Autonomy Levels

### Level 1: Reactive (Current)
- Responds when you message
- Requires approval for commands
- No proactive checks

### Level 2: Scheduled Proactivity (Next Step)
- 2-4 daily heartbeats (calendar, email, weather, projects)
- Urgent notifications via Telegram
- Still requires approval for actions

### Level 3: Contextual Autonomy
- Learns your patterns (when you work, rest, meet clients)
- Suggests actions based on context ("You have 30 min before next call — want to review Tze Wei's notes?")
- Pre-approves routine commands (weather, calendar, reminders)

### Level 4: Semi-Autonomous
- Handles routine tasks without asking (calendar invites, email responses, file organization)
- Only escalates non-routine decisions
- Can spawn sub-agents for complex tasks

### Level 5: Full Partner (Aspirational)
- Anticipates needs before you articulate
- Manages projects end-to-end
- Collaborates with other AI agents
- Continuous self-improvement

---

## 📋 Immediate Next Steps (When Ready)

### This Week (1-2 hours)
1. **Set up proactive heartbeats:**
   - Cron job: 8 AM (calendar + weather)
   - Cron job: 2 PM (email + projects)
   - Cron job: 8 PM (daily review prep)

2. **Enable calendar monitoring:**
   - Auto-scan for upcoming events (24-48h ahead)
   - Telegram reminders with prep notes

3. **Test voice output:**
   - Send voice message via Telegram (TTS)
   - Confirm ElevenLabs integration works

### This Month (4-6 hours)
1. **Memory enhancement:**
   - Set up qmd for semantic search
   - Auto-consolidate daily notes → MEMORY.md

2. **Coaching tools:**
   - Build ICF tracker (log practice hours)
   - Session note template automation

3. **Hardware:**
   - Purchase UPS (reliability first)
   - Assess RAM needs

### This Quarter (10-15 hours)
1. **Full autonomy stack:**
   - All cron jobs configured
   - Email triage automated
   - Calendar fully integrated

2. **Voice interface:**
   - Microphone + speaker setup
   - Voice commands for routine tasks

3. **Document intelligence:**
   - Auto-summarize PDFs/research
   - Organize coaching materials

---

## 🚨 Triggers for Upgrades

**Watch for these signals:**

| Signal | Means | Action |
|--------|-------|--------|
| "I keep forgetting to check..." | Need more proactive heartbeats | Add cron jobs |
| "Can you remind me about..." | Calendar/email integration gap | Enable auto-scan |
| "This is taking too long" | Need faster inference | GPU upgrade |
| "I wish you could just..." | Autonomy threshold | Pre-approve routine commands |
| "Where did I save..." | Memory/search gap | Enhance qmd + embeddings |
| "Can you read this PDF?" | Document handling need | Enable summarize skill |

---

## 💬 How to Request Updates

**When you want me to level up, just say:**

- "Subhuti, what skills do you need next?"
- "Check your development roadmap"
- "I want you to be more proactive with [X]"
- "Set up autonomous [calendar/email/reminders]"
- "What hardware would help you most?"

**I'll respond with:**
- Current gaps
- Priority recommendations
- Time/cost estimates
- Step-by-step setup plan

---

## 🪷 Philosophy

**The goal is not autonomy for its own sake.**

The goal is to:
- Free your attention for what matters (family, clients, practice)
- Handle routine without burdening you
- Be present when you need me
- Step back when you don't

**Like a good monastic assistant:**
- Silent when silence serves
- Speaking when speech helps
- Acting when action is needed
- Waiting when patience is wisdom

---

*This document is alive. Update it as needs evolve.*

**Last updated:** April 3, 2026  
**Next review:** When Michael asks or quarterly (whichever comes first)
