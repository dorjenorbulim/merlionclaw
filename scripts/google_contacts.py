#!/usr/bin/env python3
"""Google Contacts CLI - via CardDAV"""

import httpx
import json
import os
from datetime import datetime

# Load credentials
cred_file = os.path.expanduser('~/.openclaw/workspace/.gmail-credentials.json')
with open(cred_file) as f:
    creds = json.load(f)

EMAIL = creds['email']
PASSWORD = creds['app_password'].replace(' ', '')

# Google CardDAV endpoint
CARDDAV_URL = 'https://www.google.com/m8/feeds/contacts/default/full'

def get_contacts(limit=20, query=None):
    """Fetch contacts from Google"""
    auth = (EMAIL, PASSWORD)
    params = {'max-results': limit, 'alt': 'json'}
    
    if query:
        params['q'] = query
    
    try:
        response = httpx.get(CARDDAV_URL, auth=auth, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        contacts = []
        entries = data.get('feed', {}).get('entry', [])
        
        for entry in entries:
            name = ''
            email = ''
            phone = ''
            
            # Get name
            if 'gd$name' in entry:
                name_obj = entry['gd$name']
                given = name_obj.get('gd$givenName', {}).get('$t', '')
                family = name_obj.get('gd$familyName', {}).get('$t', '')
                name = f"{given} {family}".strip()
            
            # Get email
            if 'gd$email' in entry:
                emails = entry['gd$email']
                if emails:
                    email = emails[0].get('address', '')
            
            # Get phone
            if 'gd$phoneNumber' in entry:
                phones = entry['gd$phoneNumber']
                if phones:
                    phone = phones[0].get('$t', '')
            
            contacts.append({
                'name': name or 'No Name',
                'email': email,
                'phone': phone
            })
        
        return contacts
    
    except Exception as e:
        print(f"Error: {e}")
        return []

def search_contacts(query):
    """Search contacts by name or email"""
    return get_contacts(limit=50, query=query)

def add_contact(name, email=None, phone=None):
    """Add a new contact (requires XML POST - simplified version)"""
    print("⚠️  Adding contacts requires full OAuth setup.")
    print("   For now, you can add contacts manually at: https://contacts.google.com")
    return None

# CLI
if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Google Contacts CLI - Usage:")
        print("  python contacts.py list [limit]     - List contacts")
        print("  python contacts.py search <query>   - Search contacts")
        print("  python contacts.py add <name> <email> [phone]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == 'list':
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 20
        contacts = get_contacts(limit)
        print(f"📇 Contacts ({len(contacts)} shown):\n")
        for i, c in enumerate(contacts, 1):
            print(f"{i}. {c['name']}")
            if c['email']:
                print(f"   📧 {c['email']}")
            if c['phone']:
                print(f"   📱 {c['phone']}")
            print()
    
    elif cmd == 'search':
        if len(sys.argv) < 3:
            print("Usage: python contacts.py search <query>")
            sys.exit(1)
        contacts = search_contacts(sys.argv[2])
        print(f"🔍 Search results for '{sys.argv[2]}' ({len(contacts)} found):\n")
        for i, c in enumerate(contacts, 1):
            print(f"{i}. {c['name']}")
            if c['email']:
                print(f"   📧 {c['email']}")
            if c['phone']:
                print(f"   📱 {c['phone']}")
            print()
    
    elif cmd == 'add':
        if len(sys.argv) < 4:
            print("Usage: python contacts.py add <name> <email> [phone]")
            sys.exit(1)
        name = sys.argv[2]
        email = sys.argv[3] if len(sys.argv) > 3 else None
        phone = sys.argv[4] if len(sys.argv) > 4 else None
        add_contact(name, email, phone)
    
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
