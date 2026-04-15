# Weekly Security Audit — April 12, 2026

**Audit Time:** 11:00 PM SGT  
**Audit Type:** Deep Scan (`openclaw security audit --deep`)  
**Auditor:** Subhuti (automated)

---

## 🔒 Security Summary

| Severity | Count | Status |
|----------|-------|--------|
| **Critical** | 0 | ✅ |
| **Warning** | 3 | ⚠️ |
| **Info** | 1 | ℹ️ |

**Overall:** SECURE (no critical issues)

---

## ⚠️ Warnings (3)

### 1. Gateway Trusted Proxies Missing
**Issue:** Reverse proxy headers are not trusted  
**Detail:** `gateway.bind` is loopback and `gateway.trustedProxies` is empty. If you expose the Control UI through a reverse proxy, configure trusted proxies so local-client checks cannot be spoofed.  
**Risk:** Low (only matters if exposing Control UI via reverse proxy)  
**Fix:** 
- Option A: Set `gateway.trustedProxies` to your proxy IPs
- Option B: Keep Control UI local-only (current setup — acceptable)

**Action Required:** ❌ No (keeping local-only is fine)

---

### 2. Plugin Installs Unpinned npm Specs
**Issue:** Plugin installs include unpinned npm specs  
**Affected Plugin:** `openclaw-web-search` (@ollama/openclaw-web-search)  
**Risk:** Medium (supply-chain stability)  
**Fix:** Pin install specs to exact versions (e.g., `@scope/pkg@1.2.3`)

**Action Required:** ✅ Yes (should pin version)

---

### 3. Plugin Installs Missing Integrity
**Issue:** Plugin installs are missing integrity metadata  
**Affected Plugin:** `openclaw-web-search`  
**Risk:** Low-Medium (can't verify plugin hasn't been tampered with)  
**Fix:** Reinstall or update plugins to refresh install metadata with resolved integrity hashes

**Action Required:** ✅ Yes (reinstall plugin)

---

## ℹ️ Info (1)

### Attack Surface Summary
- **Groups:** open=0, allowlist=3
- **Tools Elevated:** Enabled
- **Hooks Webhooks:** Disabled
- **Hooks Internal:** Enabled
- **Browser Control:** Enabled
- **Trust Model:** Personal assistant (one trusted operator boundary), not hostile multi-tenant on one shared gateway

**Assessment:** ✅ Appropriate for single-user setup

---

## 🔄 Update Status

| Item | Status |
|------|--------|
| **Install Method** | pnpm |
| **Channel** | stable (default) |
| **Current Version** | 2026.4.10 (assumed) |
| **Available Version** | 2026.4.11 |
| **Update Command** | `openclaw update` |

**Action Required:** ✅ Yes (update available)

---

## 📝 Recommended Actions (Priority Order)

### 1. Update OpenClaw (5 minutes)
```bash
openclaw update
```
**Why:** Security patches, bug fixes, new features  
**Risk:** Low (stable channel)  
**Priority:** 🔴 High

### 2. Reinstall web-search Plugin (2 minutes)
```bash
openclaw plugins uninstall openclaw-web-search
openclaw plugins install @ollama/openclaw-web-search@latest
```
**Why:** Pins version + adds integrity hash  
**Risk:** Low (plugin is well-maintained)  
**Priority:** 🟡 Medium

### 3. Review Trusted Proxies (Optional)
**Decision:** Keep local-only (no action needed unless exposing Control UI)  
**Priority:** 🟢 Low (only if architecture changes)

---

## ✅ Next Audit

**Scheduled:** Sunday, April 19, 2026, 11:00 PM SGT  
**Reminder:** Automated via cron (`healthcheck:security-audit`)

---

## 🪷 Notes

**Security Posture:** Strong  
- No critical vulnerabilities
- All warnings are fixable with minor updates
- Single-user trust model appropriate for this setup
- No hostile multi-tenant exposure

**Michael's Action Items:**
1. Run `openclaw update` when convenient (tonight or tomorrow)
2. Reinstall web-search plugin (after update)
3. No urgent security concerns — sleep well 🪷

---

*Audit completed: April 12, 2026, 11:02 PM SGT*  
*Next audit: April 19, 2026*
