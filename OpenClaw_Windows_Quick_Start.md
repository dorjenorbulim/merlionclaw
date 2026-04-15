# OpenClaw + Ollama Windows Setup Guide

**For:** Complete beginners (no coding experience)  
**Platform:** Windows 10/11  
**Time:** 30-45 minutes  
**Cost:** Free

---

## 📋 What You're Building

**OpenClaw** = AI assistant that runs on YOUR computer (not cloud)

**Think:** ChatGPT, but:
- ✅ Private (conversations stay on your PC)
- ✅ Free (no monthly subscription)
- ✅ Works offline (after setup)
- ✅ Customizable (add "skills")

---

## ⚠️ Before You Start

**Requirements:**
- Windows 10 or 11 (64-bit)
- 8GB RAM minimum (16GB recommended)
- 10GB free storage
- Internet connection (for setup only)

---

## 🚀 Step-by-Step Instructions

### Step 1: Install Ollama (10 mins)

**Ollama runs the AI models on your PC.**

1. **Go to:** https://ollama.com/download

2. **Click:** "Download for Windows"

3. **Run the installer:**
   - Double-click `OllamaSetup.exe`
   - Click "Next" through the wizard
   - Accept default settings
   - Click "Install"

4. **Wait for installation** (5-10 minutes)

5. **When done:**
   - Ollama icon appears in system tray (bottom-right corner)
   - It's running automatically

**✅ How to know it worked:**
- Ollama icon in system tray
- No error messages

---

### Step 2: Download AI Model (15 mins)

**This is the "brain" — the AI you'll talk to.**

1. **Open PowerShell:**
   - Press: `Windows Key + X`
   - Select: "Windows PowerShell" or "Terminal"

2. **Type this command:**
   ```powershell
   ollama pull qwen2.5:latest
   ```

3. **Press Enter**

4. **Wait for download** (10-20 minutes, ~4.7GB)
   - You'll see progress percentage
   - Don't close the window

**✅ How to know it worked:**
- You'll see "success" at the end

**Optional (lighter model, faster but less smart):**
```powershell
ollama pull gemma3:4b
```

---

### Step 3: Install OpenClaw (10 mins)

**OpenClaw is the interface — how you chat with the AI.**

**Option A: Using winget (Windows Package Manager)**

1. **In PowerShell, type:**
   ```powershell
   winget install openclaw
   ```

2. **Press Enter**

3. **Wait for installation** (5-10 minutes)

**Option B: Manual Install (if winget doesn't work)**

1. **Go to:** https://github.com/openclaw/openclaw/releases

2. **Download:** Latest Windows version (`.exe` or `.zip`)

3. **Run installer** or extract zip file

4. **Add to PATH** (if needed):
   - Search "Environment Variables" in Windows
   - Add OpenClaw folder to System PATH

**✅ How to know it worked:**
- No error messages during install

---

### Step 4: Configure OpenClaw (5 mins)

**Tell OpenClaw which AI model to use.**

1. **Open File Explorer**

2. **Go to:**
   ```
   C:\Users\YOUR_USERNAME\.openclaw\
   ```
   (Replace `YOUR_USERNAME` with your Windows username)

3. **Find the file:** `openclaw.json`

4. **Open with Notepad:**
   - Right-click → Open with → Notepad

5. **Find the `"model"` section**

6. **Change it to:**
   ```json
   "model": {
     "primary": "ollama/qwen2.5:latest"
   }
   ```

7. **Save the file:**
   - Press `Ctrl + S`
   - Close Notepad

**✅ How to know it worked:**
- File saved without error

---

### Step 5: Start OpenClaw (2 mins)

**Time to turn it on!**

1. **Open PowerShell**

2. **Type:**
   ```powershell
   openclaw gateway start
   ```

3. **Press Enter**

4. **Wait 10-20 seconds**

**✅ How to know it worked:**
- You'll see "Gateway started" or similar message

---

### Step 6: Test It! (2 mins)

**Let's see if it works!**

**Option A: Via Web Dashboard**

1. **Open your browser** (Chrome, Edge, Firefox)

2. **Go to:**
   ```
   http://127.0.0.1:18789/
   ```

3. **You should see:** OpenClaw dashboard

4. **Try chatting:**
   - Type: "Hello, who are you?"
   - Press Enter
   - Wait for response (5-10 seconds)

**Option B: Via Telegram (Optional)**

1. **Open Telegram**

2. **Create a bot:**
   - Search for "@BotFather"
   - Send: `/newbot`
   - Follow prompts to name your bot
   - BotFather gives you a **token** (long string)
   - Save this token

3. **Configure OpenClaw:**
   - Open `C:\Users\YOUR_USERNAME\.openclaw\openclaw.json` in Notepad
   - Find `"channels"` section
   - Add:
   ```json
   "channels": {
     "telegram": {
       "enabled": true,
       "botToken": "YOUR_TOKEN_HERE"
     }
   }
   ```
   - Replace `YOUR_TOKEN_HERE` with your actual token
   - Save file

4. **Restart OpenClaw:**
   ```powershell
   openclaw gateway restart
   ```

5. **Connect to your bot:**
   - In Telegram, search for your bot's name
   - Send `/start`
   - It should respond!

---

## ✅ You're Done!

**If you got a response** — congratulations! 🎉

**Your AI assistant is now:**
- Running locally on your PC
- Ready to chat
- Private (no data sent to companies)
- Free (no monthly fees)

---

## 🛠️ Quick Reference Commands

### Start OpenClaw
```powershell
openclaw gateway start
```

### Stop OpenClaw
```powershell
openclaw gateway stop
```

### Restart OpenClaw
```powershell
openclaw gateway restart
```

### Check Status
```powershell
openclaw status
```

### Download New AI Model
```powershell
ollama pull model-name
```

### List Installed Models
```powershell
ollama list
```

---

## ⚠️ Troubleshooting

### ❌ "openclaw is not recognized"

**Problem:** OpenClaw not in PATH

**Solution:**
- Try full path: `C:\Program Files\OpenClaw\openclaw.exe gateway start`
- Or add to PATH via Environment Variables

---

### ❌ "Connection refused" or "Can't connect to Ollama"

**Problem:** Ollama not running

**Solution:**
- Check system tray for Ollama icon
- If not there, search "Ollama" in Start menu and open it
- Retry starting OpenClaw

---

### ❌ "Port already in use"

**Problem:** Something else is using port 18789

**Solution:**
- Close other apps that might use that port
- Or edit `openclaw.json` to use different port (e.g., 18790)

---

### ❌ PowerShell says "execution policy"

**Problem:** Windows blocking scripts

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
- Press Y, then Enter

---

### ❌ Model download stuck or fails

**Problem:** Internet connection issue

**Solution:**
- Check your internet
- Try again: `ollama pull qwen2.5:latest`
- Or try smaller model: `ollama pull gemma3:4b`

---

### ❌ PC is slow or fan is loud

**Problem:** AI models use resources — this is normal

**Solution:**
- Close other apps if needed
- Consider using lighter model: `gemma3:4b` (2.5GB vs 4.7GB)
- It's okay to let your PC work hard sometimes

---

## 📚 Next Steps

### Add Skills (Optional)

**Skills = extra capabilities**

**Popular ones:**
```powershell
clawhub install decision-journal
clawhub install productivity
clawhub install writing
clawhub install portfolio-monitor
```

**How to install:**
1. Open PowerShell
2. Type the command
3. Press Enter
4. Wait for "OK. Installed" message

---

### Daily Use

**To use OpenClaw:**

1. **Start it:**
   ```powershell
   openclaw gateway start
   ```

2. **Chat via:**
   - Web dashboard: http://127.0.0.1:18789/
   - Telegram bot (if configured)
   - Other channels (WhatsApp, etc.)

3. **Stop it when done:**
   ```powershell
   openclaw gateway stop
   ```

---

## 💡 Tips for Friends

### 1. **First Time Setup**
- Follow the steps exactly
- Don't skip the Ollama model download (takes longest)
- Be patient (30-45 mins total)

### 2. **After Setup**
- OpenClaw doesn't need to run 24/7
- Start it when you want to use it
- Stop it when done (saves resources)

### 3. **Privacy**
- Your conversations stay on YOUR PC
- Nothing is sent to companies
- You own your data

### 4. **Cost**
- Free! No monthly fees
- Just your electricity and internet

### 5. **Getting Help**
- Check this guide again
- Ask the person who shared this with you
- OpenClaw Discord: https://discord.gg/clawd
- GitHub Issues: https://github.com/openclaw/openclaw/issues

---

## 🎯 What You Can Do With OpenClaw

**Examples:**

- ✅ Chat and ask questions
- ✅ Get help with writing (emails, documents, creative)
- ✅ Brainstorm ideas
- ✅ Learn new topics
- ✅ Plan your day
- ✅ Track decisions
- ✅ Monitor investments (with portfolio-monitor skill)
- ✅ Automate repetitive tasks
- ✅ And much more...

**Limitations:**
- ❌ Not connected to internet by default (privacy feature)
- ❌ Can't generate images (text only)
- ❌ Can't make voice calls (text only)

---

## 🙏 Credits

**Guide created by:** Michael Lim KC  
**For:** Singapore OpenClaw Community  
**Date:** April 3, 2026  
**License:** Free to share and modify

**Full repo:** https://github.com/dorjenorbulim/merlionclaw

---

## 📞 Support

**If you get stuck:**

1. **Re-read this guide** (most issues are covered)
2. **Ask the friend who shared this** (they've done it before)
3. **OpenClaw Discord:** https://discord.gg/clawd
4. **GitHub Issues:** https://github.com/openclaw/openclaw/issues

---

*Last Updated: April 3, 2026*  
*For: Windows beginners (no coding needed)*  
*Tested on: Windows 10/11 (64-bit)*
