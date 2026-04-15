# Weekly Security Audit — April 5, 2026

**Audit Date:** Sunday, April 5, 2026, 11:00 PM SGT  
**Audit Type:** Deep scan (`openclaw security audit --deep`)  
**Auditor:** Subhuti (automated weekly check)

---

## 📊 Summary

| Severity | Count | Status |
|----------|-------|--------|
| **Critical** | 0 | ✅ |
| **Warning** | 3 | ⚠️ |
| **Info** | 1 | ℹ️ |

**Overall:** No critical issues. 3 warnings require attention (non-urgent).

---

## ⚠️ Warnings

### 1. Reverse Proxy Headers Not Trusted
**Issue:** `gateway.trustedProxies` is empty. Gateway is bound to loopback (127.0.0.1).

**Risk:** If Control UI is exposed through a reverse proxy, local-client checks could be spoofed.

**Fix Options:**
- **Option A (Recommended):** Keep Control UI local-only (no reverse proxy). No action needed.
- **Option B:** If exposing via reverse proxy, set `gateway.trustedProxies` to your proxy IPs.

**Michael's Context:** Control UI is currently local-only (http://127.0.0.1:18789/). **No action required** unless you plan to expose it publicly.

---

### 2. Plugin Installs Include Unpinned npm Specs
**Issue:** `openclaw-web-search` (@ollama/openclaw-web-search) has unpinned npm spec.

**Risk:** Supply-chain stability — unpinned specs could pull unexpected versions on reinstall.

**Fix:** Pin to exact version (e.g., `@ollama/openclaw-web-search@1.2.3`)

**Action Required:** Yes (low priority, but good practice)

---

### 3. Plugin Installs Missing Integrity Metadata
**Issue:** `openclaw-web-search` install record missing integrity hash.

**Risk:** Cannot verify plugin hasn't been tampered with.

**Fix:** Reinstall or update plugin to refresh integrity metadata.

**Action Required:** Yes (can combine with #2)

---

## ℹ️ Info

### Attack Surface Summary
- **Groups:** 0 open, 3 allowlist
- **Tools (elevated):** Enabled
- **Webhooks:** Disabled
- **Internal hooks:** Enabled
- **Browser control:** Enabled
- **Trust model:** Personal assistant (one trusted operator boundary)

**Assessment:** Appropriate for single-user, trusted environment. Not hardened for hostile multi-tenant (not needed for Michael's use case).

---

## 🔄 Update Status

| Item | Status |
|------|--------|
| **Install Method** | pnpm |
| **Channel** | stable (default) |
| **Current Version** | 2026.4.2 |
| **Update Status** | ✅ Up to date |

**No updates pending.**

---

## 📝 Action Items

### This Week (Low Priority):
- [ ] Reinstall `openclaw-web-search` plugin to fix integrity + pin version
  ```bash
  openclaw plugins uninstall openclaw-web-search
  openclaw plugins install @ollama/openclaw-web-search@<latest-version>
  ```

### No Urgent Action Required:
- Trusted proxies warning is fine (Control UI is local-only)
- No critical vulnerabilities
- System is secure for current use case

---

## 🔒 Security Posture Assessment

**Current State:** ✅ **Good**

**Strengths:**
- No critical vulnerabilities
- Gateway on loopback (not exposed)
- Webhooks disabled (reduced attack surface)
- Single trusted operator model (appropriate for personal use)

**Areas to Improve:**
- Plugin integrity metadata (supply-chain hygiene)
- Consider pinning all plugin versions (stability)

**Recommendation:** Address plugin warnings in next maintenance window (not urgent).

---

## 📅 Next Audit

**Scheduled:** Sunday, April 12, 2026, 11:00 PM SGT

**Automated via:** OpenClaw weekly cron reminder

---

**Audit logged by:** Subhuti  
**Review status:** ✅ No user action required (warnings are low-priority)
