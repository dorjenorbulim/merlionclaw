# Section 1031 Like-Kind Exchange Basis Carryover and PTET Election Coordination for Real Estate Partnerships 2026

**Research Date:** April 7, 2026  
**Word Count:** ~650 words

---

## Executive Summary

When real estate partnerships execute Section 1031 like-kind exchanges while electing Pass-Through Entity Tax (PTET) in one or more states, critical basis tracking complexities emerge. PTET payments reduce partnership inside basis under IRC Section 705, but this reduction must be carefully coordinated with deferred gain calculations and replacement property basis carryover rules. The interaction creates potential mismatches between federal and state basis schedules, affects depreciation recapture potential, and requires dual-tracking documentation across exchange cycles.

---

## Core Mechanics: PTET Basis Adjustments in 1031 Context

### Inside Basis Reduction Timing

PTET payments reduce partnership inside basis as **deemed distributions** under IRC Section 705(a)(2)(B). The critical question for 1031 exchanges is **when** this reduction occurs relative to the exchange timeline:

- **Relinquished property transfer year:** If PTET is paid in Year 1 when relinquished property is transferred, inside basis is reduced **before** computing deferred gain
- **Replacement property acquisition year:** If replacement property is acquired in Year 2 (within the 180-day exchange period), the reduced basis carries over to the replacement property
- **Result:** Lower replacement property basis → higher depreciation deductions but greater potential gain on future disposition

### Deferred Gain Calculation Impact

Under Section 1031, deferred gain equals:
```
Deferred Gain = Realized Gain - Boot Received + Boot Paid
```

PTET affects this calculation indirectly:
- PTET payments **do not** constitute boot (they are entity-level tax payments, not cash received by the partnership)
- However, PTET-reduced inside basis **increases realized gain** on the relinquished property
- **Net effect:** Larger deferred gain amount, but basis carryover to replacement property reflects PTET reduction

---

## Multi-State Exchange Complications

### Relinquished vs. Replacement Property State Mismatch

When relinquished property is in a PTET-electing state (e.g., California) but replacement property is in a non-PTET state (e.g., Texas):

| Issue | Federal Treatment | PTET State Treatment | Non-PTET State Treatment |
|-------|-------------------|----------------------|--------------------------|
| **Deferred gain** | Fully deferred under §1031 | Deferred, but PTET paid on gain recognized at entity level | Deferred (if state conforms to §1031) |
| **Replacement basis** | Carryover basis reduced by PTET | Same as federal | May not recognize PTET basis reduction |
| **Future depreciation** | Based on federal carryover basis | Based on state carryover basis (may differ) | Based on state law (may not match federal) |

**Practical consequence:** Partnerships must maintain **three separate basis schedules** (federal, PTET state, non-PTET state) when executing cross-state 1031 exchanges.

### State-Specific PTET Recognition

- **California:** PTET reduces inside basis; replacement property basis reflects PTET payment even if property is out-of-state
- **New York:** PTET basis adjustments tracked separately; requires Form IT-204-IP credit allocation to partners
- **New Jersey:** PTET creates book-tax disparities requiring Section 704(c) tracking if replacement property has different nexus profile
- **Non-conforming states (e.g., Pennsylvania):** May not recognize PTET basis reductions, creating permanent differences

---

## Boot Allocation and PTET Disparities

When 1031 exchanges include boot (cash or non-like-kind property), PTET creates allocation complexities:

### Boot Calculation with PTET

If partnership receives $100,000 boot and paid $50,000 PTET in the exchange year:
- **Federal:** $100,000 boot recognized as gain
- **PTET state:** PTET payment may be allocated against boot gain, reducing partner-level tax due
- **Documentation requirement:** Partnership must track whether PTET credit offsets boot gain at entity level or flows through to partners

### Partner-Level Impact

Partners receiving K-1s from PTET-electing partnerships executing 1031 exchanges must:
1. Report deferred gain on federal return (Form 8824)
2. Claim PTET credit on resident state return (if different from PTET state)
3. Track basis differences between federal and state schedules
4. Coordinate PTET credit with estimated tax payments to avoid overpayment

---

## Documentation Requirements for Audit Defense

Partnerships executing 1031 exchanges with PTET elections should maintain:

### Required Records

- **PTET election confirmation** (state filing receipts, payment confirmations)
- **Section 1031 exchange agreement** (qualified intermediary documentation)
- **Basis tracking worksheets** showing:
  - Relinquished property federal basis
  - PTET basis reduction amount and timing
  - Replacement property carryover basis (federal and state)
  - Deferred gain calculations with PTET adjustments
- **K-1 workpapers** allocating PTET credits and basis adjustments to partners
- **Multi-state nexus analysis** if replacement property is in different state

### Recommended Best Practices

1. **Create separate tax basis books** for federal, PTET state, and non-PTET state tracking
2. **Document PTET payment timing** relative to exchange deadlines (45-day identification, 180-day completion)
3. **Notify partners** of basis adjustments before K-1 issuance to enable accurate estimated tax planning
4. **Coordinate with qualified intermediaries** to ensure PTET payments don't inadvertently create constructive receipt issues

---

## Practical Planning Considerations

### When PTET May Not Be Optimal for 1031 Exchanges

Partnerships should consider **declining PTET** if:
- Replacement property will be held short-term (<3 years) before disposition
- Partners are in low-tax resident states (PTET credit may exceed state tax due)
- Exchange spans multiple states with conflicting PTET treatment
- Partnership anticipates future Section 754 election (PTET basis reductions complicate adjustments)

### When PTET Adds Value

PTET elections remain beneficial when:
- Partners reside in high-tax states (CA, NY, NJ) and can fully utilize credits
- Partnership plans long-term hold on replacement property (>5 years)
- PTET enables SALT deduction workaround exceeding entity-level tax cost
- Partnership has consistent multi-state income requiring composite filings

---

## Conclusion

Section 1031 like-kind exchanges and PTET elections can coexist, but require meticulous basis tracking and multi-state coordination. The key insight: **PTET basis reductions carry through the exchange** to replacement property, affecting future depreciation and gain calculations. Partnerships must maintain parallel basis schedules, document timing mismatches, and educate partners on credit coordination. For complex multi-state exchanges, consider engaging tax counsel familiar with both PTET regimes and like-kind exchange rules to avoid costly basis errors.

---

**Related Topics:** Section 754 elections with PTET, multi-tier partnership 1031 exchanges, PTET revocation procedures mid-exchange cycle
