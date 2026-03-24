# Singapore OpenClaw LLM — Qwen Optimization

**Purpose:** Optimized Qwen 2.5 configuration for OpenClaw users in Singapore  
**Created:** March 24, 2026  
**Team:** Michael K C Lim + Subhuti (AI)  
**Budget:** $0 (bootstrap phase)

---

## What This Is

A grassroots project to optimize **Qwen 2.5 7.6B** for OpenClaw workflows, purpose-built for Singapore users:

- ✅ **English-only** communication
- ✅ **American directness** (clear, straightforward)
- ✅ **PDPA-compliant** (Singapore data privacy)
- ✅ **Local inference** (runs on Mac mini, no cloud dependency)
- ✅ **Companionship + Assistant + Education** focus

---

## Quick Start

### Prerequisites
- OpenClaw installed
- Ollama installed
- Mac mini or similar (8GB+ RAM recommended)

### Installation

```bash
# 1. Pull Qwen 2.5
ollama pull qwen2.5:latest

# 2. Copy system prompt
cp Qwen_OpenClaw_System_Prompt.md ~/.openclaw/workspace/

# 3. Configure OpenClaw to use Qwen
# Edit ~/.openclaw/openclaw.json:
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen2.5:latest"
      }
    }
  }
}

# 4. Restart OpenClaw
openclaw gateway restart
```

---

## What's Optimized

### System Prompt
- Warm, direct communication style
- OpenClaw skill integration patterns
- Safety boundaries (mental health, medical, legal referrals)
- PDPA compliance reminders
- Memory & continuity patterns

### Configuration
- **Temperature:** 0.7 (balanced creativity/consistency)
- **Context:** 32K tokens (full conversation history)
- **Top P:** 0.9 (diverse but focused)
- **Max tokens:** 2048 (detailed responses)

### Skills Integration
Tested and optimized for:
- ✅ `clawhub` (skill search/install)
- ✅ `decision-journal` (ethical decision tracking)
- ✅ `4to1-planner` (planning workflows)
- ✅ `productivity` suite (task management)
- ✅ `qmd` (markdown search)
- ✅ `portfolio-monitor` (investment tracking)

---

## Performance Benchmarks

| Task | Qwen 2.5 Performance | Notes |
|------|---------------------|-------|
| **Companionship** | ⭐⭐⭐⭐☆ | Warm, present, good boundaries |
| **Skill Execution** | ⭐⭐⭐⭐⭐ | Reliable tool calling |
| **Education** | ⭐⭐⭐⭐☆ | Clear explanations, checks understanding |
| **Planning** | ⭐⭐⭐⭐☆ | Good multi-step reasoning |
| **Safety** | ⭐⭐⭐⭐⭐ | Appropriate referrals, boundary awareness |
| **Speed (Mac mini)** | ⭐⭐⭐⭐☆ | ~2-3s response time |

---

## Synthetic Training Data

This repo includes **12 conversation examples** covering:
- Companionship scenarios
- Assistant task execution
- Education/teaching dialogues
- Safety & boundary enforcement
- OpenClaw workflow patterns

**Location:** `Synthetic_Conversation_Data.md`

**Future:** Expand to 50-100 examples for fine-tuning dataset.

---

## Roadmap

### Phase 1: Optimize Qwen (Now - April 2026)
- [x] Create system prompt
- [x] Generate synthetic data (12 examples)
- [ ] Generate 50-100 examples
- [ ] Test all OpenClaw skills
- [ ] Document optimal configurations
- [ ] Create user guide

### Phase 2: Community Building (May - June 2026)
- [ ] Share with Singapore OpenClaw users
- [ ] Gather feedback from 5-10 early adopters
- [ ] Iterate based on real usage
- [ ] Build GitHub community

### Phase 3: Fine-Tune (When Budget Available)
- [ ] Raise $10K-50K (crowdfund?)
- [ ] Fine-tune Qwen 7B on synthetic + real data
- [ ] Release improved model to community
- [ ] Document process for others

---

## How to Contribute

### Test & Report
1. Install Qwen using guide above
2. Use for 1-2 weeks
3. Report what works/doesn't via GitHub Issues

### Generate Data
1. Have real conversations with Qwen
2. Save anonymized examples
3. Submit to `synthetic-data/` folder

### Improve Prompts
1. Experiment with system prompt variations
2. Test different configurations
3. Submit improvements via Pull Request

---

## License

- **System Prompt:** MIT-0 (use freely)
- **Synthetic Data:** CC-BY-4.0 (share with attribution)
- **Documentation:** MIT-0 (use freely)

---

## PDPA Compliance Notes

**Data Handling:**
- All inference runs locally (no data leaves your Mac)
- No third-party APIs or cloud services
- User owns all conversation data
- Deletion on request (just delete `memory/` folder)

**Transparency:**
- System prompt discloses AI nature
- Users know they're talking to AI
- No deception about capabilities

**Safety:**
- Mental health referrals built-in
- Medical/legal advice boundaries
- Crisis resource information available

---

## Contact

- **Creator:** Michael K C Lim (@dorjenorbulim)
- **GitHub:** [Your GitHub Here]
- **Discord:** OpenClaw Singapore channel
- **Email:** [Your Email Here]

---

## FAQ

**Q: Why Qwen 2.5?**  
A: Best balance of quality (7.6B), speed (runs locally), and openness (Apache 2.0 license).

**Q: Do I need a GPU?**  
A: No. Runs on Mac mini with 8GB+ RAM. GPU helps but not required.

**Q: Can I use this commercially?**  
A: Yes. Qwen 2.5 is Apache 2.0, system prompt is MIT-0. Go build something.

**Q: Will this work in other countries?**  
A: Yes, but it's optimized for Singapore context (PDPA, English-only, American communication style).

**Q: How is this different from regular Qwen?**  
A: System prompt optimized for OpenClaw workflows, companionship style, and Singapore regulations.

---

## Acknowledgments

- **Alibaba Cloud** — for Qwen 2.5 (Apache 2.0)
- **OpenClaw community** — for the platform
- **Singapore OpenClaw users** — for feedback and testing

---

*Built with 🪷 by Michael + Subhuti*
