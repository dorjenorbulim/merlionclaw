#!/usr/bin/env python3
"""Google Services OAuth Setup - Tasks, Contacts, Keep, Photos"""

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Scopes for all services
SCOPES = [
    'https://www.googleapis.com/auth/tasks',           # Google Tasks
    'https://www.googleapis.com/auth/contacts',        # Google Contacts  
    'https://www.googleapis.com/auth/keep',            # Google Keep
    'https://www.googleapis.com/auth/photoslibrary',   # Google Photos
    'https://www.googleapis.com/auth/youtube.readonly' # YouTube (read-only)
]

def main():
    token_file = os.path.expanduser('~/.google-services-token.json')
    cred_file = os.path.expanduser('~/.gmail-credentials.json')
    
    # Load existing credentials
    with open(cred_file) as f:
        creds_data = json.load(f)
    
    # Create OAuth credentials file
    oauth_cred_file = os.path.expanduser('~/.google-oauth-credentials.json')
    oauth_creds = {
        "installed": {
            "client_id": creds_data.get('oauth_client_id', '234922258906-h156dqro4quv3cut1bajdb9q7rj9fg6b.apps.googleusercontent.com'),
            "client_secret": creds_data.get('oauth_client_secret', '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'),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost:8081/"]
        }
    }
    
    with open(oauth_cred_file, 'w') as f:
        json.dump(oauth_creds, f, indent=2)
    
    creds = None
    
    # Load existing token
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    
    # Refresh or re-authenticate
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Refreshing token...")
            creds.refresh(Request())
        else:
            print("\n🪷  Google Services Authorization")
            print("=" * 40)
            print("\nThis will grant access to:")
            print("  ✅ Google Tasks")
            print("  ✅ Google Contacts")
            print("  ✅ Google Keep")
            print("  ✅ Google Photos")
            print("  ✅ YouTube (read-only)")
            print("\nOpening browser for authorization...")
            
            flow = InstalledAppFlow.from_client_secrets_file(oauth_cred_file, SCOPES)
            creds = flow.run_local_server(port=8081)
        
        # Save token
        with open(token_file, 'w') as token:
            token.write(creds.to_json())
        
        print(f"\n✅ Credentials saved!")
        print(f"   Token: {token_file}")
    else:
        print("✅ Google services already authorized!")
    
    # Test connections
    print("\n🔍 Testing service connections...")
    from googleapiclient.discovery import build
    
    try:
        service = build('tasks', 'v1', credentials=creds)
        tasklists = service.tasklists().list().execute()
        print(f"  ✅ Tasks: {len(tasklists.get('items', []))} task lists")
    except Exception as e:
        print(f"  ⚠️  Tasks: {e}")
    
    # Note: Contacts API v3 requires different setup
    print(f"  ℹ️  Contacts: Requires separate setup (people API)")
    
    print("\n🪷  Setup complete!")

if __name__ == '__main__':
    main()
