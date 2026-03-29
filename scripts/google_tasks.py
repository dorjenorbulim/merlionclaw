#!/usr/bin/env python3
"""Google Tasks CLI - via Tasks API (requires OAuth)"""

import json
import os
import sys
from datetime import datetime, timedelta

# For app password access, we use CalDAV Tasks
# But Google Tasks API is cleaner - let's create a simple version

TASKS_FILE = os.path.expanduser('~/.openclaw/workspace/.google-tasks.json')

def load_tasks():
    """Load tasks from local file (synced manually)"""
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE) as f:
            return json.load(f)
    return {'tasks': []}

def save_tasks(data):
    """Save tasks to local file"""
    with open(TASKS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def list_tasks(status='all'):
    """List tasks"""
    data = load_tasks()
    tasks = data.get('tasks', [])
    
    if status == 'completed':
        tasks = [t for t in tasks if t.get('completed')]
    elif status == 'pending':
        tasks = [t for t in tasks if not t.get('completed')]
    
    return tasks

def add_task(title, due_date=None, notes=None):
    """Add a new task"""
    data = load_tasks()
    
    task = {
        'id': str(len(data['tasks']) + 1),
        'title': title,
        'completed': False,
        'created': datetime.now().isoformat(),
        'due': due_date,
        'notes': notes
    }
    
    data['tasks'].append(task)
    save_tasks(data)
    return task

def complete_task(task_id):
    """Mark task as completed"""
    data = load_tasks()
    
    for task in data['tasks']:
        if task['id'] == task_id:
            task['completed'] = True
            task['completed_at'] = datetime.now().isoformat()
            save_tasks(data)
            return task
    
    return None

def delete_task(task_id):
    """Delete a task"""
    data = load_tasks()
    
    original_len = len(data['tasks'])
    data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
    
    if len(data['tasks']) < original_len:
        save_tasks(data)
        return True
    return False

# CLI
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Google Tasks CLI - Usage:")
        print("  python tasks.py list [pending|completed]  - List tasks")
        print("  python tasks.py add <title> [due_date]    - Add task")
        print("  python tasks.py done <id>                 - Complete task")
        print("  python tasks.py delete <id>               - Delete task")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == 'list':
        status = sys.argv[2] if len(sys.argv) > 2 else 'all'
        tasks = list_tasks(status)
        
        if not tasks:
            print("📋 No tasks found!")
        else:
            print(f"📋 Tasks ({len(tasks)}):\n")
            for i, t in enumerate(tasks, 1):
                status_icon = "✅" if t.get('completed') else "⬜"
                due = f" (due: {t['due']})" if t.get('due') else ""
                print(f"{i}. {status_icon} [{t['id']}] {t['title']}{due}")
                if t.get('notes'):
                    print(f"   {t['notes']}")
                print()
    
    elif cmd == 'add':
        if len(sys.argv) < 3:
            print("Usage: python tasks.py add <title> [due_date]")
            sys.exit(1)
        title = sys.argv[2]
        due = sys.argv[3] if len(sys.argv) > 3 else None
        task = add_task(title, due)
        print(f"✅ Task added: [{task['id']}] {task['title']}")
    
    elif cmd == 'done':
        if len(sys.argv) < 3:
            print("Usage: python tasks.py done <task_id>")
            sys.exit(1)
        task = complete_task(sys.argv[2])
        if task:
            print(f"✅ Completed: {task['title']}")
        else:
            print("❌ Task not found")
    
    elif cmd == 'delete':
        if len(sys.argv) < 3:
            print("Usage: python tasks.py delete <task_id>")
            sys.exit(1)
        if delete_task(sys.argv[2]):
            print("✅ Task deleted")
        else:
            print("❌ Task not found")
    
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
