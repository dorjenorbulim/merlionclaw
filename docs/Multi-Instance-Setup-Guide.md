# Multi-Instance OpenClaw Setup Guide

**For:** Michael K C Lim — Household with Multiple OpenClaw Bots  
**Created:** April 3, 2026  
**Purpose:** Run multiple OpenClaw instances without gateway conflicts

---

## ⚠️ The Problem

Two OpenClaw instances in same household = **gateway port conflict**

Both try to use:
- Port: `18789`
- Bind: `loopback` (127.0.0.1)

**Result:** Second instance can't connect.

---

## ✅ Solution: Different Ports

| Instance | Device | Port | Status |
|----------|--------|------|--------|
| **Primary** | Mac mini (Subhuti) | 18789 | ✅ Keep as-is |
| **Secondary** | Windows PC | 18790 | ⚙️ Change to this |

---

## 🛠️ On Windows OpenClaw

### Step 1: Stop Gateway

```powershell
openclaw gateway stop
```

### Step 2: Edit Config File

**Location:**
```
C:\Users\<Username>\.openclaw\openclaw.json
```

**Find this section:**
```json
"gateway": {
  "bind": "loopback",
  "mode": "local",
  "port": 18789
}
```

**Change to:**
```json
"gateway": {
  "bind": "loopback",
  "mode": "local",
  "port": 18790
}
```

### Step 3: Restart Gateway

```powershell
openclaw gateway start
```

### Step 4: Verify

```powershell
openclaw status
```

Or test directly:
```powershell
curl http://127.0.0.1:18790
```

Should return gateway info (not "connection refused").

---

## 📋 PowerShell Automation Script

**Copy-paste this into Windows PowerShell:**

```powershell
# Stop gateway
openclaw gateway stop

# Backup config
Copy-Item ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# Edit port
$config = Get-Content ~/.openclaw/openclaw.json -Raw | ConvertFrom-Json
$config.gateway.port = 18790
$config | ConvertTo-Json -Depth 10 | Set-Content ~/.openclaw/openclaw.json

# Restart
openclaw gateway start

# Verify
openclaw status

Write-Host "✅ Gateway now running on port 18790"
```

---

## 🪷 Recommended: Different Identities

**Avoid confusion between bots:**

| Aspect | Mac (Primary) | Windows (Secondary) |
|--------|---------------|---------------------|
| **Name** | Subhuti | Ananda (or other) |
| **Emoji** | 🪷 | 🌟 |
| **Telegram Bot** | @SubhutiBot | @AnandaBot (create new) |
| **Workspace** | `~/.openclaw/workspace` | Separate directory |
| **Memory** | Separate MEMORY.md | Separate MEMORY.md |

### **Why Different Identities?**

- ✅ No message confusion (which bot is which?)
- ✅ No memory bleeding
- ✅ No identity conflicts
- ✅ Clear separation of concerns

---

## 🔍 Troubleshooting

### **Windows Firewall Blocking**

```powershell
# Allow port through firewall
netsh advfirewall firewall add rule name="OpenClaw 18790" dir=in action=allow protocol=TCP localport=18790
```

### **Port Still in Use**

```powershell
# Check what's using the port
netstat -ano | findstr :18790

# Kill the process if needed
taskkill /PID <PID> /F
```

### **Workspace Conflicts**

Ensure each instance has **separate workspace**:

**Windows config:**
```json
"agents": {
  "defaults": {
    "workspace": "C:\\Users\\<Username>\\.openclaw\\workspace"
  }
}
```

**Mac config:**
```json
"agents": {
  "defaults": {
    "workspace": "/Volumes/Subhuti Main/openclaw-workspace"
  }
}
```

---

## 📊 Port Assignment Table

**For future expansion:**

| Instance | Device | Location | Port |
|----------|--------|----------|------|
| Subhuti | Mac mini | Living room | 18789 |
| Ananda | Windows PC | Office | 18790 |
| Future 1 | Raspberry Pi | Bedroom | 18791 |
| Future 2 | Laptop | Mobile | 18792 |

---

## ✅ Final Checklist

**After setup, verify:**

- [ ] Mac bot responds on port 18789
- [ ] Windows bot responds on port 18790
- [ ] Both can run simultaneously
- [ ] Separate workspaces (no file conflicts)
- [ ] Separate Telegram bots (if using)
- [ ] Separate memory files

---

## 🙏 Notes

**This setup allows:**
- ✅ Multiple bots in same household
- ✅ No gateway conflicts
- ✅ Independent operation
- ✅ Easy to add more instances

**Each bot should have:**
- Unique port
- Unique workspace
- Unique identity (name, emoji, Telegram bot)
- Independent memory

---

*Created with care for Michael's multi-bot household.* 🪷

**Last updated:** April 3, 2026
