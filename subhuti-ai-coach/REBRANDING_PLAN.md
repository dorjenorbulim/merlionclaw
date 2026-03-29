# 🌿 Mindful AI Coach — Secular Rebranding Plan

**Remove religious language, keep mindfulness methodology**

---

## 🎯 Why Secular?

- **Broader market appeal** (not just Buddhist-interested)
- **Enterprise-friendly** (HR doesn't worry about religion)
- **Evidence-based positioning** (science > spirituality)
- **Inclusive** (all backgrounds welcome)

---

## 📝 Naming Options

| Current | Option 1 | Option 2 | Option 3 |
|---------|----------|----------|----------|
| Subhuti AI Coach | **Mindful AI Coach** | **Present AI Coach** | **Clarity AI Coach** |
| Domain: subhuti.ai | mindful.ai | present.ai | clarity.ai |
| Tagline: Buddhist-informed | Mindfulness-based | Evidence-based | Clarity-focused |

**Recommendation:** **Mindful AI Coach** (clear, descriptive, secular)

---

## 🔄 Terminology Changes

### Core Concepts

| Buddhist Term | Secular Replacement |
|---------------|---------------------|
| Buddhist-informed | Mindfulness-based / Evidence-based |
| Buddhist wisdom | Timeless wisdom / Mindful insights |
| Buddhist psychology | Mindfulness psychology |
| Dharma | Principles / Practice |
| Sangha | Community |
| Karma | Cause and effect / Patterns |
| Nirvana | Peace / Clarity |
| Suffering | Stress / Difficulty |
| Non-attachment | Healthy detachment / Balance |
| Impermanence | Change is constant / Flow |
| Emptiness | Openness / Possibility |
| Middle Way | Balance / Moderation |
| Right speech | Clear communication |
| Right action | Ethical action |
| Mindfulness | Mindfulness (keep) |
| Meditation | Meditation / Practice (keep) |
| Compassion | Compassion / Kindness (keep) |
| Loving-kindness | Kindness / Care |
| Equanimity | Balance / Stability |

### Three Pillars (Rename)

**Current:**
- Wisdom (Paññā)
- Compassion (Karunā)
- Skillful Means (Upāya)

**Secular:**
- **Awareness** — Understanding patterns, change, and perspective
- **Kindness** — Compassionate response to self and others
- **Balance** — Adapting to individual needs and contexts

---

## 🎨 Visual Changes

### Emoji
| Current | Replace With |
|---------|--------------|
| 🪷 Lotus | 🌿 Plant / 🧘 Person / ✨ Sparkles |
| 🙏 Prayer hands | 🤝 Hands / 💙 Heart |

### Colors
- Keep: Calm greens, blues (mindfulness associations)
- Avoid: Saffron/orange (monk robe associations)

### Imagery
- Use: Nature, calm spaces, diverse people
- Avoid: Buddha statues, mandalas, prayer beads

---

## 📄 Files to Update

### High Priority (Before Beta)

**1. Landing Page** (`src/app/page.tsx`)
```tsx
// Before:
<h1>Subhuti AI Coach</h1>
<p>Buddhist-informed AI coaching with persistent memory</p>

// After:
<h1>Mindful AI Coach</h1>
<p>Mindfulness-based AI coaching with persistent memory</p>
```

**2. AI Coach Persona** (`src/lib/ai/coach.ts`)
```typescript
// Before:
const SYSTEM_PROMPT = `You are Subhuti AI Coach, a Buddhist-informed AI coaching assistant.

## Your Approach (The Subhuti Method)
**Three Pillars:**
1. **Wisdom (Paññā)** — Help users understand impermanence, non-self
2. **Compassion (Karunā)** — Respond with loving-kindness
3. **Skillful Means (Upāya)** — Adapt to individual needs`;

// After:
const SYSTEM_PROMPT = `You are Mindful AI Coach, a mindfulness-based AI coaching assistant.

## Your Approach (The Mindful Method)
**Three Pillars:**
1. **Awareness** — Help users recognize patterns, embrace change, gain perspective
2. **Kindness** — Respond with compassion to self and others
3. **Balance** — Adapt to individual needs and contexts`;
```

**3. Daily Nudges** (`subhuti-coach-framework/04-daily-nudge-library.md`)
```markdown
// Before:
"🪷 **Loving-Kindness Practice:** May I be well. May I be happy. May I be at ease."

// After:
"🌿 **Kindness Practice:** May I be well. May I be happy. May I be at ease."
```

**4. Content Calendar** (`subhuti-coach-framework/05-content-calendar-30-days.md`)
```markdown
// Before:
"Week 1: Foundation (mindfulness basics, Buddhist intention-setting)"

// After:
"Week 1: Foundation (mindfulness basics, intention-setting)"
```

### Medium Priority (Before Public Launch)

**5. Documentation**
- `README.md` → Update branding
- `SETUP.md` → Update naming
- `RUNNING.md` → Update naming

**6. Database Comments**
```sql
-- Before: Buddhist-informed AI coaching
-- After: Mindfulness-based AI coaching
```

**7. Email Templates**
- Remove 🪷 emoji
- Update signature

---

## 🧘 Methodology (Keep the Core, Change the Label)

### What Stays (It's Already Secular-Friendly)

✅ **Mindfulness practices** — Evidence-based, widely accepted  
✅ **Breathing exercises** — Universal, non-religious  
✅ **Body scan** — Clinical technique  
✅ **Loving-kindness meditation** — Studied in psychology  
✅ **Non-judgment** — CBT-aligned  
✅ **Present-moment awareness** — Mindfulness-Based Stress Reduction (MBSR)  
✅ **Acceptance** — ACT (Acceptance and Commitment Therapy) aligned  

### What Changes (Religious Framing)

❌ **"Buddhist psychology"** → **"Mindfulness psychology"**  
❌ **"Three Marks of Existence"** → **"Core Insights"**  
❌ **"Four Noble Truths"** → **"Framework for Working with Difficulty"**  
❌ **"Eightfold Path"** → **"Eight Practices"**  
❌ **"Enlightenment"** → **"Clarity" / "Awakening"**  
❌ **"Dharma"** → **"Principles" / "Teachings"**  

---

## 📊 Market Positioning

### Before (Religious)
> "Buddhist-informed AI coaching for burnout recovery"

**Appeals to:**
- Buddhists (small niche)
- Spiritually curious (medium niche)
- **Turns off:** Corporate HR, secular users, other faiths

### After (Secular)
> "Evidence-based mindfulness AI coaching for burnout recovery"

**Appeals to:**
- Everyone experiencing stress/burnout
- Corporate wellness programs
- Healthcare systems
- **Still includes:** Buddhist methodology (just not labeled)

---

## 🎯 Implementation Checklist

### Before Beta Launch:
- [ ] Rename app to "Mindful AI Coach" (or chosen name)
- [ ] Update landing page (remove Buddhist references)
- [ ] Update AI persona (secular framing)
- [ ] Replace 🪷 with 🌿 or 🧘
- [ ] Update Three Pillars naming
- [ ] Review all user-facing text

### Before Public Launch:
- [ ] Update all documentation
- [ ] Update database schema comments
- [ ] Update email templates
- [ ] Update social media profiles
- [ ] Trademark search for new name
- [ ] Secure domain (mindful.ai or similar)

---

## 💡 Key Insight

**The methodology doesn't change.** You're still teaching:
- Mindfulness
- Compassion
- Non-attachment
- Present-moment awareness
- Working with difficult emotions

**Only the framing changes.** From "Buddhist" to "Evidence-based mindfulness."

This is actually **more authentic** — mindfulness has been secularized and validated by science (MBSR, MBCT, ACT). You're not losing anything; you're making it accessible to everyone who needs it.

---

## 📚 Secular Mindfulness Lineage

You're in good company:

- **Jon Kabat-Zinn** — MBSR (Mindfulness-Based Stress Reduction)
  - Removed Buddhist cosmology
  - Kept core practices
  - Now in 800+ hospitals worldwide

- **Steven Hayes** — ACT (Acceptance and Commitment Therapy)
  - Acceptance, defusion, present-moment
  - Buddhist roots, secular framing
  - Evidence-based, widely adopted

- **Tara Brach** — RAIN practice
  - Recognition, Acceptance, Investigation, Non-identification
  - Buddhist teacher, secular language
  - Mainstream popularity

**You're continuing this tradition:** Ancient wisdom, modern language, accessible to all.

---

**Status:** Rebranding plan ready. Implementation tomorrow. 🌿
