# OpenClaw Windows Multi-User Setup Guide

**For:** Families or shared computers (2-5 users)  
**Platform:** Windows 10/11  
**Privacy:** Full data segregation per user  
**Created:** March 26, 2026  
**By:** Michael K C Lim + Subhuti 🪷

---

## What You're Building

**Three separate OpenClaw instances** on one Windows PC:

| User | Telegram Bot | Port | Memory Folder | Privacy |
|------|--------------|------|---------------|---------|
| **User 1** | Bot Token 1 | 18789 | `.openclaw-user1\` | ✅ Private |
| **User 2** | Bot Token 2 | 18790 | `.openclaw-user2\` | ✅ Private |
| **User 3** | Bot Token 3 | 18791 | `.openclaw-user3\` | ✅ Private |

**Each user gets:**
- ✅ Own Telegram bot (private conversations)
- ✅ Own memory files (private notes, goals, data)
- ✅ Own conversation history (not shared with others)
- ✅ Own settings/config
- ✅ Shared Ollama models (installed once)

**Time needed:** 60-90 minutes (first-time setup)  
**Skill level:** No coding required

---

## Before You Start

### Requirements

**Hardware:**
- Windows 10 or 11 (64-bit)
- 16GB RAM recommended (8GB minimum)
- 20GB free storage
- Administrator access

**Software:**
- Ollama for Windows (we'll install)
- OpenClaw for Windows (we'll install)
- Telegram app (for creating bots)

**What you need from each user:**
- Telegram account
- Willingness to create a bot (5 mins each)
- Bot token (long string from BotFather)

---

## Overview: What We'll Do

1. Install Ollama (once, shared by all users)
2. Download AI model (once, shared by all users)
3. Create 3 Telegram bots (one per user)
4. Install OpenClaw 3 times (separate configs)
5. Configure each instance (different ports, tokens)
6. Start all 3 instances
7. Test each user's bot

---

## Step 1: Install Ollama (10 mins)

**Ollama runs the AI models — installed once, shared by all users.**

### Instructions:

1. **Download Ollama:**
   - Go to: https://ollama.com/download
   - Click "Download for Windows"
   - Save file: `OllamaSetup.exe`

2. **Run Installer:**
   - Double-click `OllamaSetup.exe`
   - Click "Next" through the wizard
   - Accept default settings
   - Click "Install"

3. **Wait for Installation:**
   - Takes 5-10 minutes
   - Ollama icon appears in system tray (bottom-right)

4. **Verify Installation:**
   - Open **PowerShell** (Windows Key + X → "Windows PowerShell")
   - Type:
   ```powershell
   ollama --version
   ```
   - Press Enter
   - You should see version number (e.g., "ollama version is 0.18.2")

✅ **Done?** Ollama is installed and running. Move to Step 2.

---

## Step 2: Download AI Model (15 mins)

**Download the AI model once — all users share it.**

### Instructions:

1. **Open PowerShell**

2. **Download Qwen 2.5:**
   ```powershell
   ollama pull qwen2.5:latest
   ```

3. **Press Enter**

4. **Wait for Download:**
   - Takes 10-20 minutes (~4.7GB)
   - You'll see progress percentage

5. **Verify Download:**
   ```powershell
   ollama list
   ```
   - You should see `qwen2.5:latest` in the list

✅ **Done?** Model downloaded. Move to Step 3.

**Optional:** Download backup model (lighter, faster):
```powershell
ollama pull gemma3:4b
```

---

## Step 3: Create 3 Telegram Bots (15 mins)

**Each user needs their own Telegram bot.**

### For Each User (Repeat 3 Times):

1. **Open Telegram App**

2. **Search for @BotFather**
   - In Telegram search bar, type: `@BotFather`
   - Click on "BotFather" (verified account)

3. **Create New Bot:**
   - Send message: `/newbot`
   - BotFather responds with instructions

4. **Name Your Bot:**
   - BotFather: "Choose a name for your bot"
   - Reply: `Family AI User 1` (or User 2, User 3)

5. **Choose Username:**
   - BotFather: "Choose a username for your bot"
   - Reply: `family_claw_user1_bot` (must end in "bot")
   - Must be unique (if taken, try `family_claw_user1_xyz_bot`)

6. **Save the Token:**
   - BotFather gives you a **token** like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456
   ```
   - **COPY THIS** (Ctrl+C)
   - **Save it** (paste into Notepad, save as "Bot Tokens.txt")
   - **Keep it private** (don't share with others)

7. **Repeat for User 2 and User 3**

### You Should Have:

| User | Bot Name | Bot Username | Token |
|------|----------|--------------|-------|
| **User 1** | Family AI User 1 | `family_claw_user1_bot` | `123456:ABC...` |
| **User 2** | Family AI User 2 | `family_claw_user2_bot` | `789012:GHI...` |
| **User 3** | Family AI User 3 | `family_claw_user3_bot` | `345678:MNO...` |

✅ **Done?** You have 3 bot tokens. Move to Step 4.

---

## Step 4: Install OpenClaw Three Times (30 mins)

**We'll install OpenClaw 3 times, each with different config.**

### Installation 1: User 1

1. **Download OpenClaw:**
   - Go to: https://github.com/openclaw/openclaw/releases
   - Download latest Windows version (`.exe` or `.zip`)

2. **Install for User 1:**
   - Run installer
   - When asked for install location, choose:
   ```
   C:\Program Files\OpenClaw-User1\
   ```
   - Complete installation

3. **Create Config Folder:**
   - Open File Explorer
   - Go to: `C:\Users\YOUR_USERNAME\`
   - Create folder: `.openclaw-user1`

4. **Create Config File:**
   - Inside `.openclaw-user1`, create file: `openclaw.json`
   - Open with Notepad
   - Paste this:
   ```json
   {
     "gateway": {
       "port": 18789,
       "mode": "local",
       "bind": "loopback",
       "auth": {
         "mode": "token",
         "token": "user1_token_12345"
       }
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "ollama/qwen2.5:latest"
         }
       }
     },
     "channels": {
       "telegram": {
         "enabled": true,
         "botToken": "PASTE_USER1_TOKEN_HERE"
       }
     }
   }
   ```

5. **Replace Token:**
   - Replace `PASTE_USER1_TOKEN_HERE` with User 1's actual bot token
   - Save file (Ctrl + S)

---

### Installation 2: User 2

1. **Install OpenClaw Again:**
   - Run installer again
   - Choose different location:
   ```
   C:\Program Files\OpenClaw-User2\
   ```

2. **Create Config Folder:**
   - Go to: `C:\Users\YOUR_USERNAME\`
   - Create folder: `.openclaw-user2`

3. **Create Config File:**
   - Inside `.openclaw-user2`, create: `openclaw.json`
   - Open with Notepad
   - Paste this:
   ```json
   {
     "gateway": {
       "port": 18790,
       "mode": "local",
       "bind": "loopback",
       "auth": {
         "mode": "token",
         "token": "user2_token_67890"
       }
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "ollama/qwen2.5:latest"
         }
       }
     },
     "channels": {
       "telegram": {
         "enabled": true,
         "botToken": "PASTE_USER2_TOKEN_HERE"
       }
     }
   }
   ```

4. **Replace Token:**
   - Replace `PASTE_USER2_TOKEN_HERE` with User 2's actual bot token
   - Save file

**Note:** Port is **18790** (different from User 1's 18789)

---

### Installation 3: User 3

1. **Install OpenClaw Again:**
   - Run installer again
   - Choose different location:
   ```
   C:\Program Files\OpenClaw-User3\
   ```

2. **Create Config Folder:**
   - Go to: `C:\Users\YOUR_USERNAME\`
   - Create folder: `.openclaw-user3`

3. **Create Config File:**
   - Inside `.openclaw-user3`, create: `openclaw.json`
   - Open with Notepad
   - Paste this:
   ```json
   {
     "gateway": {
       "port": 18791,
       "mode": "local",
       "bind": "loopback",
       "auth": {
         "mode": "token",
         "token": "user3_token_24680"
       }
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "ollama/qwen2.5:latest"
         }
       }
     },
     "channels": {
       "telegram": {
         "enabled": true,
         "botToken": "PASTE_USER3_TOKEN_HERE"
       }
     }
   }
   ```

4. **Replace Token:**
   - Replace `PASTE_USER3_TOKEN_HERE` with User 3's actual bot token
   - Save file

**Note:** Port is **18791** (different from User 1 & 2)

✅ **Done?** All 3 instances installed and configured. Move to Step 5.

---

## Step 5: Start All Three Instances (5 mins)

**Start each OpenClaw instance separately.**

### Start User 1:

1. **Open PowerShell**

2. **Navigate to User 1's folder:**
   ```powershell
   cd "C:\Program Files\OpenClaw-User1"
   ```

3. **Start OpenClaw:**
   ```powershell
   .\openclaw.exe gateway start
   ```

4. **Wait 10-20 seconds**

5. **Verify:**
   - Should see: "Gateway started"
   - Port 18789 is now in use

---

### Start User 2:

1. **Open NEW PowerShell window** (don't close User 1's)

2. **Navigate to User 2's folder:**
   ```powershell
   cd "C:\Program Files\OpenClaw-User2"
   ```

3. **Start OpenClaw:**
   ```powershell
   .\openclaw.exe gateway start
   ```

4. **Wait 10-20 seconds**

5. **Verify:**
   - Should see: "Gateway started"
   - Port 18790 is now in use

---

### Start User 3:

1. **Open ANOTHER PowerShell window** (don't close others)

2. **Navigate to User 3's folder:**
   ```powershell
   cd "C:\Program Files\OpenClaw-User3"
   ```

3. **Start OpenClaw:**
   ```powershell
   .\openclaw.exe gateway start
   ```

4. **Wait 10-20 seconds**

5. **Verify:**
   - Should see: "Gateway started"
   - Port 18791 is now in use

✅ **Done?** All 3 instances running. Move to Step 6.

---

## Step 6: Test Each User's Bot (5 mins)

**Verify each bot works independently.**

### Test User 1:

1. **Open Telegram**

2. **Search for User 1's bot:**
   - Search: `family_claw_user1_bot` (or whatever username you chose)

3. **Start Chat:**
   - Click on the bot
   - Send: `/start`

4. **Test Conversation:**
   - Send: "Hello, who are you?"
   - Wait 5-10 seconds
   - Should get a friendly reply

5. **Test Privacy:**
   - Send: "My name is User 1. Remember this."
   - Bot should confirm it remembers

---

### Test User 2:

1. **Open Telegram**

2. **Search for User 2's bot:**
   - Search: `family_claw_user2_bot`

3. **Start Chat:**
   - Send: `/start`

4. **Test Conversation:**
   - Send: "Hello, who are you?"
   - Wait 5-10 seconds
   - Should get a reply

5. **Test Privacy:**
   - Send: "My name is User 2. Remember this."
   - Bot should confirm

---

### Test User 3:

1. **Open Telegram**

2. **Search for User 3's bot:**
   - Search: `family_claw_user3_bot`

3. **Start Chat:**
   - Send: `/start`

4. **Test Conversation:**
   - Send: "Hello, who are you?"
   - Wait 5-10 seconds
   - Should get a reply

5. **Test Privacy:**
   - Send: "My name is User 3. Remember this."
   - Bot should confirm

---

### Verify Data Segregation:

**Critical Test:**

1. **Ask User 1's bot:**
   - "What is my name?"
   - Should say: "User 1"

2. **Ask User 2's bot:**
   - "What is my name?"
   - Should say: "User 2" (NOT User 1)

3. **Ask User 3's bot:**
   - "What is my name?"
   - Should say: "User 3" (NOT User 1 or 2)

✅ **If each bot remembers only its own user** — privacy is working correctly!

---

## Step 7: Daily Use

### Starting OpenClaw (All Users)

**Option A: Manual Start (Each Time)**

Open 3 PowerShell windows, run:
```powershell
# Window 1
cd "C:\Program Files\OpenClaw-User1"
.\openclaw.exe gateway start

# Window 2
cd "C:\Program Files\OpenClaw-User2"
.\openclaw.exe gateway start

# Window 3
cd "C:\Program Files\OpenClaw-User3"
.\openclaw.exe gateway start
```

**Option B: Create Batch Files (Easier)**

1. **Create User 1 Startup Script:**
   - Open Notepad
   - Paste:
   ```batch
   @echo off
   cd "C:\Program Files\OpenClaw-User1"
   .\openclaw.exe gateway start
   ```
   - Save as: `Start-User1.bat` (on Desktop)

2. **Create User 2 Startup Script:**
   - Same pattern, save as: `Start-User2.bat`

3. **Create User 3 Startup Script:**
   - Same pattern, save as: `Start-User3.bat`

4. **Daily Use:**
   - Double-click all 3 batch files
   - All instances start automatically

---

### Stopping OpenClaw

**For each user:**
```powershell
cd "C:\Program Files\OpenClaw-UserX"
.\openclaw.exe gateway stop
```

---

### Checking Status

**For each user:**
```powershell
cd "C:\Program Files\OpenClaw-UserX"
.\openclaw.exe status
```

---

## Troubleshooting

### ❌ "Port already in use"

**Problem:** Two instances trying to use same port

**Solution:**
1. Check config files (`.openclaw-user1\openclaw.json`, etc.)
2. Verify ports are different:
   - User 1: 18789
   - User 2: 18790
   - User 3: 18791
3. Restart the instance with corrected config

---

### ❌ "Cannot connect to Ollama"

**Problem:** Ollama not running

**Solution:**
1. Check system tray for Ollama icon
2. If not there, start Ollama:
   - Search "Ollama" in Start menu
   - Click to open
3. Retry starting OpenClaw

---

### ❌ "Telegram bot doesn't respond"

**Problem:** Bot token incorrect or bot not started

**Solution:**
1. Check bot token in config file (no spaces, copied fully)
2. In Telegram, send `/start` to the bot
3. Restart OpenClaw instance:
   ```powershell
   .\openclaw.exe gateway restart
   ```
4. Check bot is not blocked by user

---

### ❌ "Access denied" or "Permission denied"

**Problem:** Need administrator privileges

**Solution:**
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Retry the command

---

### ❌ PC is slow or fan is loud

**Problem:** 3 instances use significant RAM

**Solution:**
1. Check RAM usage (Task Manager → Performance)
2. If >80% RAM used:
   - Close other apps
   - Consider using lighter model: `gemma3:4b`
   - Or reduce to 2 instances instead of 3

**To switch to lighter model:**
- Edit each config file
- Change: `"primary": "ollama/qwen2.5:latest"`
- To: `"primary": "ollama/gemma3:4b"`
- Restart each instance

---

### ❌ One user's data appearing in another's chat

**Problem:** Config files pointing to same memory folder

**Solution:**
1. Check each config file
2. Verify each has unique folder:
   - User 1: `.openclaw-user1\`
   - User 2: `.openclaw-user2\`
   - User 3: `.openclaw-user3\`
3. Restart affected instances

---

## Privacy & Security Notes

### What's Private (Per User)

✅ **Conversation history** — each user sees only their own  
✅ **Memory files** — goals, notes, personal data separate  
✅ **Telegram chats** — each bot is independent  
✅ **Settings** — each user can customize their own  
✅ **Skills** — can be installed per-user or shared

### What's Shared

⚠️ **Ollama models** — installed once, used by all (4.7GB saved)  
⚠️ **Windows resources** — RAM, CPU, storage shared  
⚠️ **Internet connection** — all use same network

### Security Best Practices

1. **Keep bot tokens private**
   - Don't share tokens between users
   - Don't post tokens online
   - Store in secure location

2. **Use Windows user accounts** (optional but recommended)
   - Each family member has own Windows login
   - Adds another layer of separation

3. **Regular backups**
   - Backup each `.openclaw-userX\` folder
   - Store on external drive or cloud

4. **Keep software updated**
   ```powershell
   winget upgrade ollama
   winget upgrade openclaw
   ```

---

## FAQ

**Q: Can I add more users later (4th, 5th)?**  
**A:** Yes! Just repeat the pattern:
- Create `.openclaw-user4\` folder
- Use port 18792
- Create 4th Telegram bot
- Install OpenClaw again

**Q: How much RAM do 3 instances use?**  
**A:** Approximately:
- Ollama + model: 2-3GB
- Each OpenClaw instance: 500MB-1GB
- **Total:** ~4-6GB for 3 users
- **Recommendation:** 16GB RAM for smooth operation

**Q: Can users install their own skills?**  
**A:** Yes! Each user can:
```powershell
cd "C:\Program Files\OpenClaw-UserX"
clawhub install skill-name
```
Skills install to that user's folder only.

**Q: What if one user wants different AI model?**  
**A:** Edit that user's config file:
```json
"model": {
  "primary": "ollama/gemma3:4b"
}
```
Restart that instance only.

**Q: Can I monitor all 3 instances from one place?**  
**A:** Not by default. Each is independent. If you want monitoring, you'd need custom setup (ask Michael).

**Q: How do I delete one user's setup?**  
**A:**
1. Stop that user's instance
2. Delete folder: `C:\Program Files\OpenClaw-UserX\`
3. Delete config: `C:\Users\YOUR_USERNAME\.openclaw-userX\`
4. Revoke Telegram bot token (via @BotFather)

**Q: Can users chat with each other through their bots?**  
**A:** Not directly. Each bot is independent. If you want inter-bot communication, that requires custom development.

---

## Quick Reference Card

### Start All Instances
```powershell
# User 1
cd "C:\Program Files\OpenClaw-User1"
.\openclaw.exe gateway start

# User 2
cd "C:\Program Files\OpenClaw-User2"
.\openclaw.exe gateway start

# User 3
cd "C:\Program Files\OpenClaw-User3"
.\openclaw.exe gateway start
```

### Stop All Instances
```powershell
# User 1
cd "C:\Program Files\OpenClaw-User1"
.\openclaw.exe gateway stop

# (Repeat for User 2, User 3)
```

### Check Status
```powershell
cd "C:\Program Files\OpenClaw-UserX"
.\openclaw.exe status
```

### Install Skill (Per User)
```powershell
cd "C:\Program Files\OpenClaw-UserX"
clawhub install skill-name
```

### Download New Model
```powershell
ollama pull model-name
```

---

## Next Steps

Once setup is complete:

1. **Each user should:**
   - Chat with their bot daily
   - Test features (memory, skills, etc.)
   - Customize their experience

2. **Add useful skills:**
   ```powershell
   # For each user
   cd "C:\Program Files\OpenClaw-UserX"
   clawhub install decision-journal
   clawhub install productivity
   clawhub install writing
   ```

3. **Monitor performance:**
   - Check Task Manager for RAM/CPU usage
   - If slow, consider lighter model

4. **Backup regularly:**
   - Copy `.openclaw-userX\` folders to external drive
   - Weekly or monthly

---

## Getting Help

**If you're stuck:**

1. **Check this guide again** — maybe missed a step
2. **Ask Michael** — he set this up, can troubleshoot
3. **OpenClaw Discord** — https://discord.com/invite/clawd
4. **GitHub Issues** — https://github.com/openclaw/openclaw/issues

**Singapore users:**
- **Michael's GitHub:** https://github.com/dorjenorbulim/merlionclaw
- **Multi-user guide:** In repo as `Windows_MultiUser_Setup.md`

---

*Last Updated: March 26, 2026*  
*For: Family/shared computer setups*  
*By: Michael K C Lim + Subhuti 🪷*  
*Full Repo: https://github.com/dorjenorbulim/merlionclaw*
