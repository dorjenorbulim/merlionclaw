# Windows Installation Guide — Ollama + OpenClaw

## Step 1: Install Ollama

1. Download Ollama for Windows: https://ollama.com/download
2. Run the installer (`OllamaSetup.exe`)
3. Click **Install** (default location is fine)
4. Wait for installation to complete
5. Ollama will start automatically

**Verify:**
```powershell
ollama --version
```

---

## Step 2: Pull a Model

```powershell
ollama pull qwen3.5:cloud
```

Or any other model:
```powershell
ollama pull llama3.2
ollama pull deepseek-r1
```

**Verify:**
```powershell
ollama list
```

---

## Step 3: Install Node.js (if not installed)

1. Download Node.js LTS: https://nodejs.org/
2. Run installer, accept defaults
3. Restart your terminal

**Verify:**
```powershell
node --version
npm --version
```

---

## Step 4: Install OpenClaw

```powershell
npm install -g openclaw
```

**Verify:**
```powershell
openclaw --version
```

---

## Step 5: Start OpenClaw Gateway

```powershell
openclaw gateway start
```

---

## Step 6: Open OpenClaw

**Option A: Web Chat (default)**
- Open browser: http://127.0.0.1:18789

**Option B: Terminal UI**
```powershell
openclaw ui
```

---

## Step 7 (Optional): Configure Telegram

1. In Telegram, message `@BotFather`
2. Send `/newbot` and follow prompts
3. Copy your bot token
4. Edit config: `~/.openclaw/openclaw.json`
5. Add token under `channels.telegram.botToken`
6. Restart gateway: `openclaw gateway restart`

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ollama serve` | Start Ollama server |
| `ollama list` | List installed models |
| `openclaw gateway start` | Start OpenClaw |
| `openclaw gateway stop` | Stop OpenClaw |
| `openclaw status` | Check status |
| `openclaw doctor` | Run diagnostics |

---

## Troubleshooting

**Ollama not found:**
- Add to PATH: `C:\Users\<YourName>\AppData\Local\Programs\Ollama`

**OpenClaw not found:**
- Run: `npm install -g openclaw --force`

**Gateway won't start:**
- Check port 18789 isn't in use
- Run: `openclaw doctor --fix`

**Permission errors:**
- Run PowerShell as Administrator

---

*Last updated: April 3, 2026*
