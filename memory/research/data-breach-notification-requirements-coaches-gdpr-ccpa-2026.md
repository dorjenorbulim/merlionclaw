# Data Breach Notification Requirements for Coaches Under GDPR and CCPA 2026

**Research Date:** April 5, 2026  
**Word Count:** ~650 words

---

## Executive Summary

Coaches handling EU or California client data face strict breach notification deadlines: **72 hours under GDPR** and **30 days under California's SB 446** (effective January 1, 2026). Missing these deadlines triggers separate violations with fines up to €10 million (GDPR) or statutory damages (CCPA). This guide provides actionable compliance steps for coaching practices.

---

## GDPR: The 72-Hour Rule

### When the Clock Starts

The 72-hour notification window begins when you become **"aware"** of a breach—not when it occurred. Under GDPR, awareness means having a **reasonable degree of certainty** that a security incident compromised personal data. This typically happens when:

- Initial investigation confirms personal data was affected
- Security team verifies the incident involved personal data
- Evidence clearly indicates data compromise (even if full scope remains unknown)

**Key point:** You don't need complete certainty. If you reasonably believe personal data was compromised, the clock starts ticking.

### What Constitutes a Reportable Breach

GDPR defines a personal data breach as a security breach leading to accidental or unlawful **destruction, loss, alteration, unauthorised disclosure, or access** to personal data. Three types matter for coaches:

| Type | Examples |
|------|----------|
| **Confidentiality** | Hacker accesses client database; email sent to wrong recipient; lost laptop with unencrypted client notes |
| **Integrity** | Ransomware encrypting client session records; malicious modification of coaching notes |
| **Availability** | Accidental deletion of client records without backup; permanent data loss |

### When Notification Is Required

You must notify the supervisory authority (e.g., ICO in UK, national DPA in EU) when the breach is **"likely to result in a risk to individuals' rights and freedoms."**

**Higher risk factors** (notification likely required):
- Special category data exposed (health information, biometric data from wearables)
- Financial data (payment details, bank accounts)
- Large volume of clients affected
- Vulnerable individuals (minors, clients in crisis)
- Clear potential for identity theft, discrimination, or reputational damage

**Lower risk examples** (notification may not be required):
- Encrypted device lost with strong encryption and no key compromise
- Email recalled successfully before recipient opened it
- Breach limited to data already publicly available
- Immediate recovery with no evidence of unauthorised access

**Critical:** Even if you decide not to notify, you **must document** the breach, your reasoning, and justification in a breach register (Article 33(5)). Regulators can audit these records.

### What to Include in DPA Notification

Article 33(3) requires:
1. **Nature of the breach:** Categories and approximate numbers of individuals and records affected
2. **DPO contact:** Name and contact details of data protection officer or other contact point
3. **Likely consequences:** Description of potential impact on individuals
4. **Measures taken:** Actions taken or proposed to address the breach and mitigate effects

If you can't provide all details within 72 hours, notify with available information and explain the delay. Submit additional details in phases as investigation progresses.

### Individual Notification (High-Risk Breaches)

When a breach is **"likely to result in a high risk"** to individuals, you must also notify affected clients directly—without undue delay.

**Tell individuals:**
- Nature of the breach in clear, plain language
- DPO or contact point details
- Likely consequences
- Measures taken and steps they can take to protect themselves (e.g., password resets, monitoring for fraud)

**Exemptions:** No individual notification needed if data was encrypted (key not compromised), subsequent measures eliminated the high risk, or notification would require disproportionate effort (use public communication instead).

---

## California CCPA: The 30-Day Rule (SB 446)

### What Changed in 2026

Governor Newsom signed **SB 446** in October 2025, effective **January 1, 2026**. Previously, California law required notification "without unreasonable delay." Now:

- **30 calendar days** to notify affected California residents after discovering or being notified of a breach
- **15 calendar days** to notify California Attorney General if breach affects **more than 500 California residents** (deadline starts after notifying consumers)

### Flexibility Provisions

Businesses may delay notification when necessary for:
- Legitimate law enforcement purposes
- Determining full scope of the breach
- Restoring integrity of data systems

### What Triggers CCPA Notification

California law requires notification when **unencrypted personal information** is acquired, or reasonably believed to have been acquired, by an unauthorised person.

**Personal information includes:**
- Name + Social Security number, driver's license, or ID card number
- Name + account/credit card number + access code
- Name + medical/health insurance information
- Biometric data (increasingly relevant for coaches using wearables)

---

## Practical Compliance Framework for Coaches

### Pre-Breach Preparation

1. **Create a breach response plan** with clear escalation procedures
2. **Assign responsibility** to a specific person/team for breach management
3. **Train staff** to recognise and report security incidents immediately
4. **Maintain a breach register** (template: date, description, assessment, actions taken, notification decision)
5. **Review vendor contracts**—processors must notify you "without undue delay"; consider requiring 24-48 hour contractual deadlines

### Post-Breach Action Timeline

| Timeframe | Action |
|-----------|--------|
| **Hour 0-4** | Contain breach; preserve evidence; assemble response team; document awareness time |
| **Hour 4-24** | Assess scope; identify affected data; estimate individuals impacted; begin risk assessment |
| **Hour 24-72** | Submit GDPR notification (if required); determine if individual notification needed |
| **Day 1-30** | Complete investigation; send individual notifications; implement remediation; meet CCPA deadline if applicable |

### Processor Obligations

If you use third-party platforms (coaching software, cloud storage, transcription services), they are **data processors**. They must notify you without undue delay after becoming aware of a breach. Your contracts should specify exact timeframes and cooperation requirements.

---

## Penalties for Non-Compliance

**GDPR:**
- Failure to notify: Up to **€10 million or 2% of global annual turnover** (whichever higher)
- Separate violation from the breach itself

**CCPA:**
- Statutory damages: **$100-$750 per consumer per incident** (or actual damages, whichever greater)
- Attorney General enforcement: Up to **$7,500 per intentional violation**

---

## Key Takeaways for Coaching Practices

1. **72 hours (GDPR) and 30 days (CCPA) are hard deadlines**—build buffer time into your response plan
2. **Document every breach**, even those you don't report
3. **Encryption is your friend**—encrypted data breaches often exempt from individual notification
4. **Vendor management matters**—ensure processors have robust breach detection and rapid notification obligations
5. **When in doubt, notify**—regulators penalise non-notification more severely than over-notification

---

## Resources

- ICO (UK): [Personal data breaches: a guide](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide)
- California SB 446: [30-Day Deadline Analysis](https://www.mondaq.com/unitedstates/privacy-protection/1689268/california-sets-30-day-deadline-for-data-breach-notifications)
- GDPR Breach Checklist: [Glocert International](https://www.glocertinternational.com/resources/articles/gdpr-breach-notification-72-hour-rule/)
