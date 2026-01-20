#!/usr/bin/env python3
"""
Script to verify all existing users created before email verification was implemented
Run this to mark all old users as verified so they can log in
"""

from app import app, db
from app import User
from datetime import datetime, timedelta

def verify_existing_users():
    """Mark all existing users (created before today) as verified"""
    with app.app_context():
        # Find all unverified local users
        unverified_users = User.query.filter_by(email_verified=False, provider='local').all()
        
        print(f"Found {len(unverified_users)} unverified local users")
        
        verified_count = 0
        for user in unverified_users:
            # If user was created more than 1 day ago, they're an existing user
            # If created today but before email verification was added, also verify them
            cutoff_date = datetime(2025, 11, 13, 10, 0, 0)  # Before email verification was added
            
            if user.created_at and user.created_at < cutoff_date:
                print(f"  ✓ Verifying {user.email} (created {user.created_at})")
                user.email_verified = True
                verified_count += 1
            else:
                print(f"  - Keeping {user.email} unverified (recent signup - needs email verification)")
        
        if verified_count > 0:
            db.session.commit()
            print(f"\n✅ Verified {verified_count} existing user(s)")
        else:
            print("\n✅ No existing users need verification")
        
        # Show summary
        total_users = User.query.filter_by(provider='local').count()
        verified_users = User.query.filter_by(provider='local', email_verified=True).count()
        print(f"\n📊 Summary:")
        print(f"   Total local users: {total_users}")
        print(f"   Verified users: {verified_users}")
        print(f"   Unverified users: {total_users - verified_users}")

if __name__ == '__main__':
    print("🔍 Checking existing users...")
    print("-" * 60)
    verify_existing_users()
    print("-" * 60)
    print("✅ Done!")

