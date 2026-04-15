#!/bin/bash
# Session Backup Script — Weekly
# Copies all session JSONL files to Subhuti Main for redundancy

SOURCE="$HOME/.openclaw/agents/main/sessions/"
DEST="/Volumes/Subhuti Main/openclaw-workspace/sessions/"

# Check if destination is mounted
if [ ! -d "$DEST" ]; then
    echo "ERROR: Subhuti Main not mounted. Aborting."
    exit 1
fi

# Create dest if needed
mkdir -p "$DEST"

# Copy session files
cp -u "$SOURCE"*.jsonl "$DEST" 2>/dev/null

# Also copy session index
cp -u "$SOURCE"sessions.json "$DEST" 2>/dev/null

# Log
echo "$(date): Session backup completed. Files: $(ls -1 "$DEST"*.jsonl 2>/dev/null | wc -l)" >> "$DEST/backup.log"

echo "Session backup complete."
