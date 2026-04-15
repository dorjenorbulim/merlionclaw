# GDPR/CCPA Data Breach Incident Response Playbook for Coaches 2026

## Executive Summary

For coaches handling EU or California client data, a data breach triggers strict regulatory timelines: **72 hours** under GDPR to notify supervisory authorities, and **without unreasonable delay** under CCPA for consumer notifications. This playbook provides step-by-step incident response procedures tailored to solo and small-group coaching practices.

---

## Phase 1: Detection and Containment (Hours 0-4)

### Immediate Actions

**1. Confirm the Breach**
- Verify whether unauthorized access actually occurred (vs. false positive)
- Document the discovery time—this starts the 72-hour GDPR clock
- Identify what systems/accounts are affected (email, CRM, cloud storage, session notes)

**2. Contain the Damage**
- Change passwords for compromised accounts immediately
- Revoke access tokens and API keys if cloud services are involved
- Disable affected user accounts if internal systems are breached
- Preserve evidence: do NOT delete logs, emails, or files yet

**3. Assess Scope**
- What data was exposed? (client names, emails, session notes, payment info, biometric data)
- How many clients are affected?
- Was data encrypted at rest? (encryption may provide safe harbor from notification requirements)

**Critical Question:** Does this breach pose risk to individuals' rights and freedoms? If yes, GDPR notification is mandatory.

---

## Phase 2: Forensic Preservation (Hours 4-24)

### Documentation Requirements

**Create a Breach Log** capturing:
- Date/time of discovery and estimated breach start time
- Method of breach (phishing, misconfigured cloud storage, lost device, vendor breach)
- Categories of data exposed
- Number of affected data subjects
- Containment actions taken
- Personnel involved in response

**Preserve Evidence:**
- Screenshot error messages, unusual login alerts, or suspicious activity
- Export access logs from affected platforms
- Save phishing emails (with full headers) if applicable
- Document all decisions and their rationale

**Why This Matters:** Regulatory authorities will ask for this documentation. Poor records can lead to higher penalties even if the breach itself wasn't negligent.

---

## Phase 3: Regulatory Notification (Hours 24-72)

### GDPR Requirements (EU Clients)

**Timeline:** 72 hours from awareness to supervisory authority notification

**Notify If:** Breach is likely to result in risk to individuals' rights/freedoms

**Notification Must Include:**
- Nature of the breach (categories of data, approximate number of clients)
- Data Protection Officer contact info (or equivalent point of contact)
- Likely consequences of the breach
- Measures taken or proposed to address/mitigate the breach

**Where to Notify:**
- Ireland (GDPR Hub): Data Protection Commission (for many US-based services)
- Your local EU supervisory authority if you're established in EU
- Use the ICBEN portal for cross-border cases

**Delay Beyond 72 Hours?** You must provide reasons for the delay alongside the notification.

### CCPA Requirements (California Clients)

**Timeline:** "Without unreasonable delay" (typically interpreted as 30-45 days, but sooner is better)

**Notify If:** Unencrypted personal information was accessed/acquired by unauthorized party

**Notification Must Include:**
- Plain language description of what happened
- Types of personal information involved
- Your contact information
- Identity theft prevention tips
- Information about free credit monitoring if offered

**Method:** Written notice via mail or email (if email was not compromised), or conspicuous website notice if breach affects 500+ California residents.

---

## Phase 4: Client Communication (Hours 48-96)

### When to Notify Clients

**GDPR:** Required if breach is likely to result in **high risk** to individuals (e.g., exposure of sensitive data, financial info, or data enabling identity theft)

**CCPA:** Required for California residents if unencrypted personal information was breached

**Exemption:** If data was encrypted using industry-standard methods and encryption keys were not compromised, notification may not be required (safe harbor provision)

### Client Notification Template Structure

```
Subject: Important Notice About Your Data [Coach Practice Name]

Dear [Client Name],

I'm writing to inform you of a data security incident that may have 
affected your personal information.

What Happened: [Brief, honest description]
What Information Was Involved: [Specific data types]
What I'm Doing: [Containment and remediation steps]
What You Can Do: [Protective actions—password changes, monitoring]
How to Reach Me: [Contact information]

I sincerely apologize for this incident and any concern it may cause.

[Your Name]
[Date]
```

**Tone:** Transparent, accountable, actionable. Avoid legalese.

---

## Phase 5: Post-Incident Review (Week 1-2)

### Root Cause Analysis

**Questions to Answer:**
- How did the breach occur? (human error, technical vulnerability, vendor failure)
- Could this have been prevented?
- What controls failed or were absent?
- Is our incident response plan adequate?

### Remediation Actions

**Immediate:**
- Patch vulnerabilities or misconfigurations
- Update passwords and access controls
- Enhance monitoring/alerting

**Medium-Term:**
- Implement or upgrade encryption at rest
- Enable multi-factor authentication across all systems
- Review vendor security practices (if third-party breach)
- Conduct staff training on phishing/data handling

**Documentation:**
- Update incident response playbook with lessons learned
- Document all remediation steps for regulatory compliance
- Consider engaging external security audit if breach was significant

---

## Practical Tools for Coaches

### Pre-Breach Preparation

**Checklist:**
- [ ] Maintain inventory of all systems storing client data
- [ ] Document data flows (where client info lives, who has access)
- [ ] Enable encryption on cloud storage (Google Drive, Dropbox, etc.)
- [ ] Turn on MFA for all accounts
- [ ] Create template breach notification letters
- [ ] Identify legal counsel or privacy consultant on retainer
- [ ] Test backup restoration procedures

### Vendor Breach Considerations

If your CRM, email provider, or coaching platform is breached:
- Request written confirmation of the breach from the vendor
- Ask for their incident report and timeline
- Determine your notification obligations (you're still responsible even if vendor caused it)
- Review your data processing agreement for breach notification clauses

---

## Penalty Exposure

**GDPR:** Up to €10 million or 2% of global annual turnover (whichever is higher) for breach notification failures; up to €20 million or 4% for substantive privacy violations

**CCPA:** Statutory damages of $100-$750 per consumer per incident in private actions; civil penalties up to $7,500 per intentional violation in AG actions

**Mitigation:** Prompt notification, transparent communication, and documented remediation efforts significantly reduce penalty risk.

---

## Key Takeaways

1. **72 hours is not a suggestion**—it's a hard deadline under GDPR
2. **Document everything** from the moment of discovery
3. **Encryption is your friend**—it may exempt you from notification requirements
4. **Clients appreciate transparency**—honest, timely communication preserves trust
5. **Preparation prevents penalties**—have templates and procedures ready before you need them

---

*Research completed: April 5, 2026*  
*Next review: October 2026 or after any regulatory update*
