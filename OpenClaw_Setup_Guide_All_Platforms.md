# OpenClaw Setup Guide — All Platforms

**For:** Complete beginners (no coding experience)  
**Platforms:** Mac, Windows, Linux  
**Created:** March 25, 2026  
**By:** Michael K C Lim + Subhuti 🪷

---

## Quick Navigation

**Choose your platform:**
- 🍎 **Mac:** [Jump to Mac Setup](#mac-setup)
- 🪟 **Windows:** [Jump to Windows Setup](#windows-setup)
- 🐧 **Linux:** [Jump to Linux Setup](#linux-setup)

---

## What is OpenClaw?

**OpenClaw** is an AI assistant that runs on **your own computer** (not in the cloud).

**Think of it like:**
- Having a smart assistant (like ChatGPT)
- But it runs locally on your computer
- Your conversations stay private (not sent to companies)
- You can add "skills" (like apps) to make it more useful

**Why use it?**
- ✅ Privacy-first (your data stays on your computer)
- ✅ Works offline (no internet needed after setup)
- ✅ Customizable (add skills for your needs)
- ✅ Free (no monthly subscription)

---

## What You'll Need

### Hardware (All Platforms)
- **Computer:** Mac (2020+), Windows PC (Win 10/11), or Linux (Ubuntu 20.04+)
- **RAM:** 8GB minimum, 16GB+ recommended
- **Storage:** 10GB free space
- **Internet:** Needed for setup only (works offline after)

### Time
- **Setup time:** 30-45 minutes
- **Skill level:** No coding needed (just follow steps)

---

# Mac Setup

## Step 1: Install Homebrew (5 mins)

**What is Homebrew?**
It's like an "app store" for technical tools. Makes installation easier.

**Instructions:**

1. Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)

2. Copy and paste this command:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Press **Enter**

4. If asked for password, type your Mac login password (you won't see letters as you type — this is normal)

5. Wait for installation to complete (2-5 minutes)

**How to know it worked:**
You'll see "Installation successful!" at the end.

---

## Step 2: Install Ollama (10 mins)

**What is Ollama?**
It runs the AI models on your Mac.

**Instructions:**

1. In Terminal, type:
```bash
brew install ollama
```

2. Press **Enter**

3. Wait for installation (5-10 minutes, downloads ~4-5GB)

4. After install, start Ollama:
```bash
ollama serve
```

**How to know it worked:**
You'll see "Listening on 127.0.0.1:11434" — leave this Terminal window open.

---

## Step 3: Download AI Model (15 mins)

**What is an AI Model?**
It's the "brain" — the AI that you'll talk to.

**Instructions:**

1. Open a **new Terminal window** (press `Cmd + T`)

2. Type:
```bash
ollama pull qwen2.5:latest
```

3. Press **Enter**

4. Wait for download (10-20 minutes, ~4.7GB)

**How to know it worked:**
You'll see "success" at the end.

---

## Step 4: Install OpenClaw (5 mins)

**Instructions:**

1. In Terminal, type:
```bash
brew install openclaw
```

2. Press **Enter**

3. Wait for installation (5-10 minutes)

**How to know it worked:**
You'll see "Installation successful" or no error messages.

---

## Step 5: Configure OpenClaw (3 mins)

**Instructions:**

1. Open the config file:
```bash
nano ~/.openclaw/openclaw.json
```

2. Find the section that says `"model"` and change it to:
```json
"model": {
  "primary": "ollama/qwen2.5:latest"
}
```

3. Save the file:
   - Press `Ctrl + O` (letter O, not zero)
   - Press `Enter`
   - Press `Ctrl + X` to exit

**How to know it worked:**
File saves without error.

---

## Step 6: Start OpenClaw (1 min)

**Instructions:**

1. In Terminal, type:
```bash
openclaw gateway start
```

2. Press **Enter**

3. Wait for it to start (10-20 seconds)

**How to know it worked:**
You'll see "Gateway started" or similar success message.

---

## Step 7: Connect via Telegram (Optional, 10 mins)

**Why Telegram?**
Easiest way to chat with OpenClaw — like texting a friend.

**Instructions:**

1. **Create a Telegram Bot:**
   - Open Telegram app
   - Search for "@BotFather"
   - Send message: `/newbot`
   - Follow prompts to name your bot
   - BotFather gives you a **token** (long string of letters/numbers)
   - **Save this token**

2. **Configure OpenClaw:**
   - In Terminal, type:
   ```bash
   nano ~/.openclaw/openclaw.json
   ```
   - Find `"channels"` section
   - Add your bot token:
   ```json
   "channels": {
     "telegram": {
       "enabled": true,
       "botToken": "YOUR_TOKEN_HERE"
     }
   }
   ```
   - Replace `YOUR_TOKEN_HERE` with your actual token
   - Save: `Ctrl + O`, `Enter`, `Ctrl + X`

3. **Restart OpenClaw:**
   ```bash
   openclaw gateway restart
   ```

4. **Connect to your bot:**
   - In Telegram, search for your bot's name
   - Send `/start`
   - It should respond!

**How to know it worked:**
You can chat with your bot in Telegram!

---

## Step 8: Test Your Setup

**Instructions:**

1. In Telegram (or Terminal), send:
```
Hello, who are you?
```

2. Wait for response (5-10 seconds)

3. You should get a friendly reply!

**If it works:** 🎉 You're set up!

---

# Windows Setup

## Step 1: Install Ollama for Windows (10 mins)

**Instructions:**

1. Go to: https://ollama.com/download

2. Click "Download for Windows"

3. Run the installer (OllamaSetup.exe)

4. Follow installation prompts
   - Click "Next" through the wizard
   - Accept default settings

5. When done, Ollama starts automatically
   - You'll see Ollama icon in system tray (bottom-right)

**How to know it worked:**
Ollama icon appears in system tray.

---

## Step 2: Download AI Model (15 mins)

**Instructions:**

1. Open **PowerShell**
   - Press: Windows Key + X
   - Select: "Windows PowerShell" or "Terminal"

2. Type:
```powershell
ollama pull qwen2.5:latest
```

3. Press **Enter**

4. Wait for download (~4.7GB, 10-20 minutes)

**How to know it worked:**
You'll see "success" at the end.

---

## Step 3: Install OpenClaw (10 mins)

**Option A: Using winget (Windows Package Manager)**

1. In PowerShell, type:
```powershell
winget install openclaw
```

2. Press **Enter**

3. Wait for installation

**Option B: Manual Install (if winget doesn't work)**

1. Go to: https://github.com/openclaw/openclaw/releases

2. Download latest Windows version (.exe or .zip)

3. Run installer or extract zip

4. Add to PATH (if needed):
   - Search "Environment Variables"
   - Add OpenClaw to System PATH

**How to know it worked:**
No error messages = success

---

## Step 4: Configure OpenClaw (5 mins)

**Instructions:**

1. Open **File Explorer**

2. Go to: `C:\Users\YOUR_USERNAME\.openclaw\`

3. Open file: `openclaw.json` (use Notepad)

4. Find the `"model"` section

5. Change to:
```json
"model": {
  "primary": "ollama/qwen2.5:latest"
}
```

6. Save file (Ctrl + S)

**How to know it worked:**
File saved without error.

---

## Step 5: Start OpenClaw (1 min)

**Instructions:**

1. Open **PowerShell**

2. Type:
```powershell
openclaw gateway start
```

3. Press **Enter**

4. Wait 10-20 seconds

**How to know it worked:**
You should see "Gateway started"

---

## Step 6: Connect via Telegram (Optional, 10 mins)

Same as Mac setup (see Mac Step 7 above).

---

## Step 7: Test Your Setup

**Instructions:**

1. In Telegram (or PowerShell), send:
```
Hello, who are you?
```

2. Wait 5-10 seconds

3. You should get a reply!

**If it works:** 🎉 You're set up!

---

# Linux Setup

## Step 1: Install Ollama (10 mins)

**Instructions:**

1. Open **Terminal**

2. Type:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

3. Press **Enter**

4. Wait for installation (5-10 minutes)

5. Start Ollama:
```bash
ollama serve
```

**How to know it worked:**
You'll see "Listening on 127.0.0.1:11434"

---

## Step 2: Download AI Model (15 mins)

**Instructions:**

1. Open **new Terminal window**

2. Type:
```bash
ollama pull qwen2.5:latest
```

3. Press **Enter**

4. Wait for download (~4.7GB, 10-20 minutes)

**How to know it worked:**
You'll see "success"

---

## Step 3: Install OpenClaw (10 mins)

**Instructions:**

1. In Terminal, type:
```bash
wget https://github.com/openclaw/openclaw/releases/latest/download/openclaw-linux-amd64.tar.gz
```

2. Extract:
```bash
tar -xzf openclaw-linux-amd64.tar.gz
```

3. Move to PATH:
```bash
sudo mv openclaw /usr/local/bin/
```

4. Make executable:
```bash
sudo chmod +x /usr/local/bin/openclaw
```

**How to know it worked:**
No error messages

---

## Step 4: Configure OpenClaw (5 mins)

**Instructions:**

1. Create config directory:
```bash
mkdir -p ~/.openclaw
```

2. Create config file:
```bash
nano ~/.openclaw/openclaw.json
```

3. Add basic config:
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen2.5:latest"
      }
    }
  }
}
```

4. Save: `Ctrl + O`, `Enter`, `Ctrl + X`

---

## Step 5: Start OpenClaw (1 min)

**Instructions:**

1. In Terminal, type:
```bash
openclaw gateway start
```

2. Press **Enter**

3. Wait 10-20 seconds

**How to know it worked:**
"Gateway started"

---

## Step 6: Connect via Telegram (Optional, 10 mins)

Same as Mac/Windows setup.

---

## Step 7: Test Your Setup

**Instructions:**

1. In Telegram (or Terminal), send:
```
Hello, who are you?
```

2. Wait 5-10 seconds

3. You should get a reply!

**If it works:** 🎉 You're set up!

---

# All Platforms: Add Skills

## Popular Beginner Skills

### Skill 1: Decision Journal (track your decisions)
```bash
clawhub install decision-journal
```

### Skill 2: Productivity (task management)
```bash
clawhub install productivity
```

### Skill 3: Writing (help with writing)
```bash
clawhub install writing
```

### Skill 4: Portfolio Monitor (track investments)
```bash
clawhub install portfolio-monitor
```

**How to install:**
1. In Terminal/PowerShell, type the command
2. Press Enter
3. Wait for "OK. Installed" message

---

# All Platforms: Daily Use

## Start OpenClaw
```bash
openclaw gateway start
```

## Stop OpenClaw
```bash
openclaw gateway stop
```

## Check Status
```bash
openclaw status
```

## Install Skill
```bash
clawhub install skill-name
```

## Download Model
```bash
ollama pull model-name
```

## Restart
```bash
openclaw gateway restart
```

---

# Troubleshooting

## Mac Issues

**❌ "Command not found"**

**Solution:**
Homebrew might not be in your path. Try:
```bash
export PATH="/opt/homebrew/bin:$PATH"
```
Then try the command again.

**❌ "Connection refused" or "Can't connect to Ollama"**

**Solution:**
Ollama might not be running. Start it:
```bash
ollama serve
```
Leave that Terminal window open while using OpenClaw.

**❌ Model download stuck or fails**

**Solution:**
- Check your internet connection
- Try again: `ollama pull qwen2.5:latest`
- If still fails, try smaller model: `ollama pull gemma3:4b`

---

## Windows Issues

**❌ "openclaw is not recognized"**

**Solution:**
- OpenClaw not in PATH
- Try: `C:\Program Files\OpenClaw\openclaw.exe`
- Or add to PATH via Environment Variables

**❌ "Connection refused" or "Can't connect to Ollama"**

**Solution:**
- Check Ollama is running (check system tray)
- Restart Ollama from system tray

**❌ PowerShell says "execution policy"**

**Solution:**
- Type: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Press Y, Enter

---

## Linux Issues

**❌ "Permission denied"**

**Solution:**
- Add sudo: `sudo openclaw gateway start`
- Or fix permissions: `sudo chown $USER:$USER /usr/local/bin/openclaw`

**❌ "Command not found"**

**Solution:**
- OpenClaw not in PATH
- Try: `/usr/local/bin/openclaw`
- Or add to PATH

---

## Common Issues (All Platforms)

**❌ Telegram bot doesn't respond**

**Solution:**
1. Check bot token is correct (no spaces, copied fully)
2. Restart OpenClaw: `openclaw gateway restart`
3. In Telegram, send `/start` to your bot
4. Check bot is not blocked

**❌ "Rate limit exceeded" when installing skills**

**Solution:**
- Wait 60-90 seconds
- Try again
- This is normal — ClawHub limits how fast you can download

**❌ Computer is slow or hot**

**Solution:**
- AI models use resources — this is normal
- Close other apps if needed
- Consider using smaller models (gemma3:4b is lighter than qwen2.5)

---

# FAQ

**Q: Is this free?**  
**A:** Yes! OpenClaw and Ollama are free. No monthly fees.

**Q: Is my data private?**  
**A:** Yes! Everything runs on your computer. Nothing is sent to companies.

**Q: Do I need internet after setup?**  
**A:** No! Once models are downloaded, it works offline.

**Q: Can I use this on other languages?**  
**A:** Yes! Qwen supports multiple languages. Just chat in your preferred language.

**Q: How do I update?**

**Mac:**
```bash
brew update
brew upgrade openclaw
brew upgrade ollama
```

**Windows:**
```powershell
winget upgrade openclaw
winget upgrade ollama
```

**Linux:**
```bash
# Re-download latest version
```

**Q: How do I delete everything?**

**Mac:**
```bash
brew uninstall openclaw
brew uninstall ollama
rm -rf ~/.openclaw
```

**Windows:**
- Uninstall via Settings > Apps
- Delete: `C:\Users\YOUR_USERNAME\.openclaw\`

**Linux:**
```bash
sudo rm /usr/local/bin/openclaw
rm -rf ~/.openclaw
```

---

# Getting Help

## If you're stuck:

1. **Check this guide again** — maybe missed a step
2. **Ask Michael** — he can help troubleshoot
3. **OpenClaw Discord** — https://discord.com/invite/clawd
4. **GitHub Issues** — https://github.com/openclaw/openclaw/issues

## For Singapore users:

- **Michael's GitHub:** https://github.com/dorjenorbulim/merlionclaw
- **Singapore OpenClaw LLM:** Optimized for local users

---

# Next Steps

Once you're comfortable:

1. **Try different models** — see which you like best
   ```bash
   ollama pull gemma3:4b
   ollama pull llama3.2:latest
   ```

2. **Add skills** — extend capabilities
   ```bash
   clawhub search productivity
   ```

3. **Customize** — make it yours
   - Edit config file
   - Adjust settings

4. **Join community** — share with other users
   - Discord: https://discord.com/invite/clawd
   - GitHub: https://github.com/openclaw/openclaw

---

*Last Updated: March 25, 2026*  
*For: Singapore OpenClaw beginners + global users*  
*By: Michael K C Lim + Subhuti 🪷*  
*Full Repo: https://github.com/dorjenorbulim/merlionclaw*
