# OpenClaw Setup Guide for Beginners

**For:** Complete beginners (no coding experience)  
**Platform:** Mac (Mac mini, MacBook, iMac)  
**Created:** March 25, 2026  
**By:** Michael K C Lim + Subhuti 🪷

---

## What is OpenClaw?

**OpenClaw** is an AI assistant that runs on **your own computer** (not in the cloud).

**Think of it like:**
- Having a smart assistant (like ChatGPT)
- But it runs locally on your Mac
- Your conversations stay private (not sent to companies)
- You can add "skills" (like apps) to make it more useful

**Why use it?**
- ✅ Privacy-first (your data stays on your computer)
- ✅ Works offline (no internet needed after setup)
- ✅ Customizable (add skills for your needs)
- ✅ Free (no monthly subscription)

---

## What You'll Need

### Hardware
- **Mac:** Mac mini, MacBook, or iMac (2020 or newer recommended)
- **RAM:** 8GB minimum, 16GB+ recommended
- **Storage:** 10GB free space
- **Internet:** Needed for setup only (works offline after)

### Time
- **Setup time:** 30-45 minutes
- **Skill level:** No coding needed (just follow steps)

---

## Step-by-Step Setup

### Step 1: Install Homebrew (Mac Package Manager)

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

### Step 2: Install Ollama (AI Model Runner)

**What is Ollama?**
It runs the AI models (like Qwen, Gemma) on your Mac.

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

**Troubleshooting:**
- If you get an error, try: `brew update` then `brew install ollama` again

---

### Step 3: Download an AI Model

**What is an AI Model?**
It's the "brain" — the AI that you'll talk to.

**Recommended for beginners:** Qwen 2.5 (good balance of speed and smarts)

**Instructions:**

1. Open a **new Terminal window** (press `Cmd + T` in Terminal, or open another Terminal)

2. Type:
```bash
ollama pull qwen2.5:latest
```

3. Press **Enter**

4. Wait for download (10-20 minutes, ~4.7GB)

**How to know it worked:**
You'll see "success" at the end.

**Other models you can try:**
- `gemma3:4b` — Google's model (lighter, faster)
- `llama3.2:latest` — Meta's model (good all-rounder)

---

### Step 4: Install OpenClaw

**What is OpenClaw?**
It's the interface that connects you to the AI model.

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

### Step 5: Configure OpenClaw

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

### Step 6: Start OpenClaw

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

### Step 7: Connect via Telegram (Optional but Recommended)

**Why Telegram?**
Easiest way to chat with OpenClaw — like texting a friend.

**Instructions:**

1. **Create a Telegram Bot:**
   - Open Telegram app
   - Search for "@BotFather"
   - Send message: `/newbot`
   - Follow prompts to name your bot
   - BotFather gives you a **token** (long string of letters/numbers)
   - **Save this token** (you'll need it)

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

**If it doesn't:** See Troubleshooting section below.

---

## Step 9: Add Skills (Optional)

**What are Skills?**
Like "apps" for your AI — adds new capabilities.

**Popular beginner skills:**

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

**How to install:**
1. In Terminal, type the command above
2. Press Enter
3. Wait for "OK. Installed" message

**How to use:**
Just ask your AI: "Help me write a email" or "Track this decision for me"

---

## Step 10: Daily Use

**To start OpenClaw:**
```bash
openclaw gateway start
```

**To stop OpenClaw:**
```bash
openclaw gateway stop
```

**To chat:**
- Via Telegram (if set up)
- Or via Terminal directly

**To add more models:**
```bash
ollama pull gemma3:4b
```

---

## Troubleshooting

### Problem: "Command not found"

**Solution:**
Homebrew might not be in your path. Try:
```bash
export PATH="/opt/homebrew/bin:$PATH"
```
Then try the command again.

---

### Problem: "Connection refused" or "Can't connect to Ollama"

**Solution:**
Ollama might not be running. Start it:
```bash
ollama serve
```
Leave that Terminal window open while using OpenClaw.

---

### Problem: Model download stuck or fails

**Solution:**
- Check your internet connection
- Try again: `ollama pull qwen2.5:latest`
- If still fails, try a smaller model: `ollama pull gemma3:4b`

---

### Problem: Telegram bot doesn't respond

**Solution:**
1. Check bot token is correct (no spaces, copied fully)
2. Restart OpenClaw: `openclaw gateway restart`
3. In Telegram, send `/start` to your bot
4. Check bot is not blocked

---

### Problem: "Rate limit exceeded" when installing skills

**Solution:**
- Wait 60-90 seconds
- Try again
- This is normal — ClawHub limits how fast you can download

---

### Problem: Mac is slow or hot

**Solution:**
- AI models use resources — this is normal
- Close other apps if needed
- Consider using smaller models (gemma3:4b is lighter than qwen2.5)

---

## FAQ

### Q: Is this free?
**A:** Yes! OpenClaw and Ollama are free. No monthly fees.

### Q: Is my data private?
**A:** Yes! Everything runs on your Mac. Nothing is sent to companies.

### Q: Do I need internet after setup?
**A:** No! Once models are downloaded, it works offline.

### Q: Can I use this on Windows?
**A:** This guide is for Mac. Windows setup is similar but commands differ.

### Q: How do I update?
**A:** 
```bash
brew update
brew upgrade openclaw
brew upgrade ollama
```

### Q: Can I chat in languages other than English?
**A:** Yes! Qwen supports multiple languages. Just chat in your preferred language.

### Q: How do I delete everything?
**A:** 
```bash
brew uninstall openclaw
brew uninstall ollama
rm -rf ~/.openclaw
```

---

## Getting Help

### If you're stuck:

1. **Check this guide again** — maybe missed a step
2. **Ask Subhuti** — your AI assistant can help troubleshoot
3. **OpenClaw Discord** — https://discord.com/invite/clawd
4. **GitHub Issues** — https://github.com/openclaw/openclaw/issues

### For Singapore users:

- **Michael's GitHub:** https://github.com/dorjenorbulim/merlionclaw
- **Singapore OpenClaw LLM:** Optimized for local users

---

## Next Steps

Once you're comfortable:

1. **Try different models** — see which you like best
2. **Add skills** — extend capabilities
3. **Customize** — make it yours
4. **Join community** — share with other users

---

## Quick Reference Card

**Start OpenClaw:**
```bash
openclaw gateway start
```

**Stop OpenClaw:**
```bash
openclaw gateway stop
```

**Check status:**
```bash
openclaw status
```

**Install skill:**
```bash
clawhub install skill-name
```

**Download model:**
```bash
ollama pull model-name
```

**Restart:**
```bash
openclaw gateway restart
```

---

*Last Updated: March 25, 2026*  
*For: Singapore OpenClaw beginners*  
*By: Michael K C Lim + Subhuti 🪷*
