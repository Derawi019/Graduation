#!/usr/bin/env python3
"""
Direct SMTP test to verify Gmail credentials work
"""
import smtplib
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

def test_gmail_smtp():
    """Test Gmail SMTP with direct connection"""
    mail_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    mail_port = int(os.getenv('MAIL_PORT', '587'))
    mail_username = os.getenv('MAIL_USERNAME', '')
    mail_password = os.getenv('MAIL_PASSWORD', '')
    use_tls = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    use_ssl = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
    
    if not mail_username or not mail_password:
        print("❌ MAIL_USERNAME or MAIL_PASSWORD not set in .env")
        return False
    
    print(f"Testing Gmail SMTP connection...")
    print(f"Server: {mail_server}")
    print(f"Port: {mail_port}")
    print(f"TLS: {use_tls}, SSL: {use_ssl}")
    print(f"Username: {mail_username}")
    
    try:
        if use_ssl:
            # Use SSL (port 465)
            print("\nConnecting with SSL...")
            server = smtplib.SMTP_SSL(mail_server, mail_port, timeout=10)
        else:
            # Use TLS (port 587)
            print("\nConnecting with TLS...")
            server = smtplib.SMTP(mail_server, mail_port, timeout=10)
            if use_tls:
                server.starttls()
        
        print("✅ Connected to server")
        
        # Login
        print("Logging in...")
        server.login(mail_username, mail_password)
        print("✅ Login successful!")
        
        # Create test email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Test Email - Translation App'
        msg['From'] = mail_username
        msg['To'] = mail_username  # Send to self
        
        text = "This is a test email to verify SMTP configuration."
        html = f"<html><body><p>{text}</p></body></html>"
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))
        
        # Send email
        print("Sending test email...")
        server.send_message(msg)
        print("✅ Email sent successfully!")
        print(f"   Check {mail_username} inbox for the test email")
        
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n❌ Authentication failed: {e}")
        print("\n💡 This usually means:")
        print("   1. Gmail App Password is incorrect")
        print("   2. 2-Factor Authentication is not enabled")
        print("   3. 'Less secure app access' needs to be enabled (deprecated)")
        print("\n   Get a new App Password at:")
        print("   https://myaccount.google.com/apppasswords")
        return False
    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    test_gmail_smtp()

