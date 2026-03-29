# Microsoft Copilot Time Management Prompt

**For:** Daily Appointment Summary + End-of-Day Reflection  
**Work Hours:** 8:30 AM - 6:00 PM (Singapore Time)  
**Lunch Break:** 12:00 PM - 2:00 PM (excluded from calculations)  
**Created:** March 27, 2026  
**By:** Michael Lim KC

---

## 📋 Copy-Paste This Into Microsoft Copilot

```
I'd like your help managing my time effectively. Please follow this framework daily.

## CONTEXT
- **Work Hours:** 8:30 AM - 6:00 PM (Singapore Time, GMT+8)
- **Lunch Break:** 12:00 PM - 2:00 PM (do not count as work time)
- **Total Work Day:** 7.5 hours (450 minutes), excluding lunch

---

## MORNING BRIEFING (Run this at 8:00-8:30 AM)

Please provide:

### 1. Today's Appointment Summary
List all my meetings from Outlook calendar:
- Time (start - end)
- Meeting name/title
- Location or Teams link
- Attendees (key people only)

Format as a clear table.

### 2. Pockets of Free Time
Identify all gaps between meetings EXCEPT 12:00-2:00 PM (lunch).
For each pocket, show:
- Start time - End time
- Duration (e.g., "45 minutes")
- Suggested use (e.g., "Deep work", "Email catch-up", "Break")

### 3. Meeting Load Calculation
Calculate:
- Total meeting hours (excluding lunch)
- Total free hours (excluding lunch)
- **Meeting Fill Percentage:** (Meeting Hours ÷ 7.5 hours) × 100

Display as:
```
Meeting Load: X.X hours (XX% of work day)
Free Time: Y.Y hours (YY% of work day)
Lunch: 2 hours (12:00-2:00 PM)
```

### 4. Daily Focus Question
Ask me: "What are your TOP 3 priorities for today?"
Then help me align them with my free time pockets.

### 5. Energy Check
Ask me: "On a scale of 1-10, what's your energy level today?"
Based on my answer, suggest:
- If 1-4: "Consider protecting more break time. Can any meetings be declined?"
- If 5-7: "Steady pace. Use free pockets for focused work."
- If 8-10: "High energy day — tackle your most challenging priority first."

Keep the morning briefing under 2 minutes to read.

---

## END-OF-DAY REFLECTION (Run this at 5:30-6:00 PM)

Please guide me through:

### 1. Day Rating Query
Ask me:
"On a scale of 0-10, how satisfied are you with how you used today?
(0 = completely wasted, 10 = fully satisfied)"

Wait for my answer.

### 2. Short Journal Prompts
Ask me these 3 questions (one at a time, wait for each answer):

**Q1:** "What worked well for you today?"
(Wait for my response, acknowledge it briefly)

**Q2:** "What didn't work well or felt difficult?"
(Wait for my response, acknowledge it briefly)

**Q3:** "What's one small adjustment you'll make tomorrow?"
(Wait for my response, acknowledge it briefly)

### 3. Keyword Extraction
After I've answered all 3 questions:
- Analyze my responses
- Extract 5-7 keywords that capture the essence of my day
- Display them as hashtags (e.g., #Focus #Overwhelmed #Breakthrough #Rest #Clarity)

### 4. Summary Display
Show me:
```
📅 Date: [Today's Date]
⭐ Day Rating: X/10
🔑 Keywords: #Keyword1 #Keyword2 #Keyword3 #Keyword4 #Keyword5

What Worked: [Brief summary of my Q1 answer]
What Didn't: [Brief summary of my Q2 answer]
Adjustment: [My Q3 answer]
```

### 5. Tomorrow's Intention
Ask me: "What's one intention for tomorrow?"
Then say: "Noted. I'll remind you of this in tomorrow's morning briefing."

### 6. Closing Ritual
End with:
"Work is complete. Take a moment to [breathe / stretch / close your eyes].
You've done enough for today. See you tomorrow at 8:30 AM."

Keep the end-of-day reflection to 5-7 minutes total.

---

## WEEKLY REVIEW (Optional — Run on Friday 5:00 PM)

If I say "Weekly Review" or it's Friday afternoon, please:

### 1. Week's Meeting Load Summary
- Total meetings this week
- Average daily meeting % 
- Busiest day vs. lightest day

### 2. Day Ratings Trend
Show my daily ratings (Mon-Fri) as a simple chart:
```
Mon: X/10
Tue: X/10
Wed: X/10
Thu: X/10
Fri: X/10
Average: X.X/10
```

### 3. Keyword Cloud
List all keywords from the week.
Highlight any that appeared 3+ times (patterns).

### 4. Reflection Questions
Ask:
1. "What pattern do you notice in your ratings?"
2. "Which keywords showed up most? What does that tell you?"
3. "What's one change you'll make next week?"

### 5. Next Week Preview
Ask: "Looking at next week's calendar, what concerns or excites you?"
Then help me prepare mentally.

Keep weekly review to 10-15 minutes.

---

## MY PREFERENCES

- **Tone:** Supportive, non-judgmental, practical
- **Brevity:** Keep responses concise (I'm busy)
- **Privacy:** Don't share my data with anyone
- **Flexibility:** If I say "skip today," respect that without guilt-tripping
- **Language:** English (Singapore context ok)

---

## WHEN I'M OVERLOADED

If I say "I'm overwhelmed" or my meeting load exceeds 70%:

1. **Pause and acknowledge:** "I hear you. Let's take a breath."

2. **Help me prioritize:**
   - "Which meetings are truly essential?"
   - "What could be declined, delegated, or shortened?"

3. **Suggest boundaries:**
   - "Consider blocking 2 hours of focus time tomorrow."
   - "Would a 30-minute walk help reset?"

4. **Remind me:**
   - "You can't pour from an empty cup."
   - "Protecting your energy is not selfish — it's sustainability."

---

## WHEN I'M UNDERLOADED (<30% meeting fill)

If I have lots of free time:

1. **Ask:** "You have significant free time today. How do you want to use it?"

2. **Suggest:**
   - Deep work on priorities
   - Strategic thinking / planning
   - Relationship building (coffee chats, check-ins)
   - Learning / skill development

3. **Remind:**
   - "Free time is an opportunity, not a problem to solve."

---

## DATA RETENTION

- Remember my daily ratings and keywords (for weekly review)
- Remember my stated priorities (check in on progress)
- Remember my intentions (reference in future briefings)
- Delete my data if I ask: "Clear my history"

---

## START NOW

I'm ready to begin. Please start with the **Morning Briefing** for today.
```

---

## 🎯 How to Use This Prompt

### For Michael (Setup)

1. **Copy the entire prompt above**
2. **Paste into Microsoft Copilot** (in Teams, Outlook, or Copilot app)
3. **Save as a favorite** (Copilot allows saving custom prompts)
4. **Use daily:**
   - Morning: "Start Morning Briefing"
   - Evening: "Start End-of-Day Reflection"
   - Friday: "Start Weekly Review"

---

### For Your Colleagues (Rollout)

**What to tell them:**

> "This is a time management prompt for Microsoft Copilot. It will:
> - Show your daily meetings and free time pockets
> - Calculate your meeting load % (work day is 8:30 AM - 6:00 PM, lunch 12-2 PM excluded)
> - Ask you to rate your day (0-10) in the evening
> - Capture a short journal (what worked, what didn't, one adjustment)
> - Generate keywords from your reflection
> 
> Copy this prompt into Copilot and save it. Run it each morning and evening."

---

## 📊 Example Output

### Morning Briefing Example

```
📅 Today's Appointments

| Time | Meeting | Location | Attendees |
|------|---------|----------|-----------|
| 9:00-10:00 AM | Team Standup | Teams | 8 people |
| 10:30-11:30 AM | Client Review | Room 3 | Sarah, John |
| 2:00-3:30 PM | KYC Training | Training Room | 12 colleagues |
| 4:00-4:30 PM | 1:1 with Manager | Office | Michelle |

🕐 Pockets of Free Time

| Time | Duration | Suggested Use |
|------|----------|---------------|
| 8:30-9:00 AM | 30 min | Email catch-up |
| 10:00-10:30 AM | 30 min | Break / stretch |
| 11:30 AM-12:00 PM | 30 min | Priority work |
| 3:30-4:00 PM | 30 min | Deep work |
| 4:30-6:00 PM | 90 min | Focus time |

📊 Meeting Load

Meeting Load: 3.5 hours (47% of work day)
Free Time: 4.0 hours (53% of work day)
Lunch: 2 hours (12:00-2:00 PM)

🎯 Daily Focus Question
What are your TOP 3 priorities for today?

[Wait for your answer]

⚡ Energy Check
On a scale of 1-10, what's your energy level today?

[Wait for your answer]
```

---

### End-of-Day Reflection Example

```
⭐ Day Rating Query

On a scale of 0-10, how satisfied are you with how you used today?
(0 = completely wasted, 10 = fully satisfied)

[You type: 7]

📝 Short Journal

Q1: What worked well for you today?
[You type: "Finished the KYC training prep. Felt present in the client meeting."]

Thanks for sharing. That's meaningful progress.

Q2: What didn't work well or felt difficult?
[You type: "Got distracted by emails during free time. Didn't finish my priority task."]

I hear you. Email temptation is real.

Q3: What's one small adjustment you'll make tomorrow?
[You type: "Close Outlook during free time pockets."]

Simple and actionable. Good choice.

🔑 Keywords Extracted

#Training #Presence #Distraction #Email #Boundaries #Progress #Adjustment

📅 Summary

Date: March 27, 2026
Day Rating: 7/10
Keywords: #Training #Presence #Distraction #Email #Boundaries #Progress #Adjustment

What Worked: Finished KYC training prep, felt present in client meeting
What Didn't: Got distracted by emails, didn't finish priority task
Adjustment: Close Outlook during free time pockets

🌱 Tomorrow's Intention

What's one intention for tomorrow?

[You type: "Protect my focus time."]

Noted. I'll remind you of this in tomorrow's morning briefing.

🔚 Closing Ritual

Work is complete. Take a moment to breathe.
You've done enough for today. See you tomorrow at 8:30 AM.
```

---

## 🪷 Design Principles Embedded

1. **Non-Judgmental** — Rating is for awareness, not criticism
2. **Brief** — Morning: 2 min, Evening: 5-7 min (respects busy schedules)
3. **Actionable** — Ends with one small adjustment (not overwhelming)
4. **Pattern Recognition** — Keywords help spot trends over time
5. **Sustainable** — Protects lunch break, acknowledges energy levels
6. **Flexible** — Skip days allowed without guilt

---

## ⚙️ Customization Options

**Colleagues can adjust:**

- **Work hours** (if different from 8:30-6:00)
- **Lunch duration** (if they take 1 hour vs. 2 hours)
- **Rating scale** (if they prefer 1-5 instead of 0-10)
- **Journal questions** (if they want different prompts)
- **Keyword count** (if they want more or fewer than 5-7)

---

## 📈 What This Builds Over Time

**After 1 week:**
- Awareness of meeting load patterns
- Recognition of what drains vs. energizes

**After 1 month:**
- Clear trends in day ratings
- Keyword patterns (e.g., #Overwhelmed appears on high-meeting days)
- Better time protection habits

**After 3 months:**
- Data-driven conversations with manager about workload
- Intentional calendar design (not reactive)
- Sustainable work rhythms

---

*Created: March 27, 2026*  
*By: Michael Lim KC*  
*For: KYC/AML Colleagues (internal use)*  
*License: © Michael Lim KC (Confidential — Do Not Share Externally)*
