#!/usr/bin/env python3
"""Gmail OAuth Setup Script"""

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# If modifying scopes, delete the token.json file.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.modify']

def main():
    creds = None
    token_file = os.path.expanduser('~/.gmail-token.json')
    cred_file = os.path.expanduser('~/.gmail-credentials.json')
    
    # Create credentials file if it doesn't exist
    if not os.path.exists(cred_file):
        print("Creating credentials file...")
        credentials = {
            "installed": {
                "client_id": "234922258906-h156dqro4quv3cut1bajdb9q7rj9fg6b.apps.googleusercontent.com",
                "client_secret": "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",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost:8080/"]
            }
        }
        with open(cred_file, 'w') as f:
            json.dump(credentials, f, indent=2)
        print(f"Credentials saved to {cred_file}")
    
    # Load or create credentials
    if os.path.exists(token_file):
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing token...")
            creds.refresh(Request())
        else:
            print("\n🪷  Opening browser for Gmail authorization...")
            print("Please sign in and grant Gmail access.")
            flow = InstalledAppFlow.from_client_secrets_file(cred_file, SCOPES)
            creds = flow.run_local_server(port=8080)
        
        # Save the credentials for the next run
        with open(token_file, 'w') as token:
            token.write(creds.to_json())
        print(f"\n✅ Credentials saved to {token_file}")
        print("Gmail access configured successfully!")
    else:
        print("✅ Gmail already configured!")
    
    # Test the connection
    print("\n📬 Testing Gmail connection...")
    from googleapiclient.discovery import build
    service = build('gmail', 'v1', credentials=creds)
    profile = service.users().getProfile(userId='me').execute()
    print(f"✅ Connected to: {profile['emailAddress']}")
    print(f"   Messages: {profile['messagesTotal']}")
    print(f"   Threads: {profile['threadsTotal']}")

if __name__ == '__main__':
    main()
