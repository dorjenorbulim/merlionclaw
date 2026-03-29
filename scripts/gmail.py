#!/usr/bin/env python3
"""Gmail CLI - Read, Search, and Send Emails"""

import imaplib
import smtplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import os
import sys
from datetime import datetime

# Load credentials
cred_file = os.path.expanduser('~/.openclaw/workspace/.gmail-credentials.json')
with open(cred_file) as f:
    creds = json.load(f)

EMAIL = creds['email']
PASSWORD = creds['app_password'].replace(' ', '')  # Remove spaces from app password
IMAP_SERVER = creds['imap_server']
SMTP_SERVER = creds['smtp_server']

def connect_imap():
    """Connect to Gmail IMAP"""
    mail = imaplib.IMAP4_SSL(IMAP_SERVER)
    mail.login(EMAIL, PASSWORD)
    return mail

def list_emails(limit=10, search='ALL'):
    """List recent emails"""
    mail = connect_imap()
    mail.select('inbox')
    
    # Search for emails
    status, messages = mail.search(None, search)
    email_ids = messages[0].split()
    
    emails = []
    for i in range(min(limit, len(email_ids))):
        email_id = email_ids[-(i+1)]  # Most recent first
        status, msg_data = mail.fetch(email_id, '(RFC822)')
        msg = email.message_from_bytes(msg_data[0][1])
        
        subject = msg.get('Subject', 'No Subject')
        sender = msg.get('From', 'Unknown')
        date = msg.get('Date', 'Unknown')
        
        emails.append({
            'id': email_id.decode(),
            'subject': subject,
            'from': sender,
            'date': date
        })
    
    mail.close()
    mail.logout()
    return emails

def read_email(email_id):
    """Read full email content"""
    mail = connect_imap()
    mail.select('inbox')
    
    status, msg_data = mail.fetch(email_id.encode(), '(RFC822)')
    msg = email.message_from_bytes(msg_data[0][1])
    
    # Get body
    body = ''
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get('Content-Disposition'))
            if content_type == 'text/plain' and 'attachment' not in content_disposition:
                try:
                    body = part.get_payload(decode=True).decode()
                    break
                except:
                    pass
    else:
        try:
            body = msg.get_payload(decode=True).decode()
        except:
            body = msg.get_payload()
    
    mail.close()
    mail.logout()
    
    return {
        'subject': msg.get('Subject', ''),
        'from': msg.get('From', ''),
        'to': msg.get('To', ''),
        'date': msg.get('Date', ''),
        'body': body
    }

def send_email(to, subject, body, cc=None):
    """Send an email"""
    msg = MIMEMultipart()
    msg['From'] = EMAIL
    msg['To'] = to
    msg['Subject'] = subject
    
    if cc:
        msg['Cc'] = cc
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Connect to SMTP server
    server = smtplib.SMTP(SMTP_SERVER, 587)
    server.starttls()
    server.login(EMAIL, PASSWORD)
    
    # Send
    recipients = [to]
    if cc:
        recipients.extend(cc.split(','))
    server.send_message(msg, to_addrs=recipients)
    server.quit()
    
    print(f"✅ Email sent to {to}")

def mark_as_read(email_id):
    """Mark email as read"""
    mail = connect_imap()
    mail.select('inbox')
    mail.store(email_id.encode(), '+FLAGS', '\\Seen')
    mail.close()
    mail.logout()

def search_emails(query, limit=10):
    """Search emails by subject or sender"""
    mail = connect_imap()
    mail.select('inbox')
    
    # Search in subject
    status, messages = mail.search(None, f'(SUBJECT "{query}")')
    email_ids = messages[0].split()
    
    # Also search in from
    status2, messages2 = mail.search(None, f'(FROM "{query}")')
    email_ids2 = set(messages2[0].split())
    email_ids.extend([e for e in email_ids2 if e not in email_ids])
    
    emails = []
    for i in range(min(limit, len(email_ids))):
        email_id = email_ids[-(i+1)]
        status, msg_data = mail.fetch(email_id, '(RFC822)')
        msg = email.message_from_bytes(msg_data[0][1])
        
        emails.append({
            'id': email_id.decode(),
            'subject': msg.get('Subject', ''),
            'from': msg.get('From', ''),
            'date': msg.get('Date', '')
        })
    
    mail.close()
    mail.logout()
    return emails

def get_unread_count():
    """Get count of unread emails"""
    mail = connect_imap()
    mail.select('inbox')
    status, messages = mail.search(None, 'UNSEEN')
    count = len(messages[0].split())
    mail.close()
    mail.logout()
    return count

# CLI Interface
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Gmail CLI - Usage:")
        print("  python gmail.py list [limit]     - List recent emails")
        print("  python gmail.py read <id>        - Read email by ID")
        print("  python gmail.py send <to> <subject> <body>")
        print("  python gmail.py search <query>   - Search emails")
        print("  python gmail.py unread           - Count unread emails")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == 'list':
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        emails = list_emails(limit)
        print(f"📬 Recent emails ({len(emails)} shown):\n")
        for i, e in enumerate(emails, 1):
            print(f"{i}. [{e['id']}] {e['subject']}")
            print(f"   From: {e['from']} | {e['date']}\n")
    
    elif cmd == 'read':
        if len(sys.argv) < 3:
            print("Usage: python gmail.py read <email_id>")
            sys.exit(1)
        email_data = read_email(sys.argv[2])
        print(f"📧 Subject: {email_data['subject']}")
        print(f"   From: {email_data['from']}")
        print(f"   To: {email_data['to']}")
        print(f"   Date: {email_data['date']}\n")
        print(f"   {email_data['body']}\n")
    
    elif cmd == 'send':
        if len(sys.argv) < 5:
            print("Usage: python gmail.py send <to> <subject> <body>")
            sys.exit(1)
        send_email(sys.argv[2], sys.argv[3], sys.argv[4])
    
    elif cmd == 'search':
        if len(sys.argv) < 3:
            print("Usage: python gmail.py search <query>")
            sys.exit(1)
        emails = search_emails(sys.argv[2])
        print(f"🔍 Search results for '{sys.argv[2]}' ({len(emails)} found):\n")
        for i, e in enumerate(emails, 1):
            print(f"{i}. [{e['id']}] {e['subject']}")
            print(f"   From: {e['from']} | {e['date']}\n")
    
    elif cmd == 'unread':
        count = get_unread_count()
        print(f"📬 Unread emails: {count}")
    
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
