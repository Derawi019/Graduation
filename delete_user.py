#!/usr/bin/env python3
"""
Script to delete a user from the database
Usage: python delete_user.py <email>
"""

import sys
from app import app, db
from app import User, Translation

def delete_user(email):
    """Delete a user and all their translations"""
    with app.app_context():
        # Find user
        user = User.query.filter_by(email=email.lower().strip()).first()
        
        if not user:
            print(f"❌ User not found: {email}")
            return False
        
        # Show user info
        print(f"Found user: {user.email}")
        print(f"  - Name: {user.name}")
        print(f"  - Provider: {user.provider}")
        print(f"  - Created: {user.created_at}")
        
        # Count translations
        translation_count = Translation.query.filter_by(user_id=user.id).count()
        print(f"  - Translations: {translation_count}")
        
        # Confirm deletion
        print(f"\n⚠️  This will delete:")
        print(f"   - User account: {user.email}")
        print(f"   - All {translation_count} translations")
        print(f"   - This action cannot be undone!")
        
        confirm = input(f"\nType 'DELETE' to confirm deletion: ")
        
        if confirm != 'DELETE':
            print("❌ Deletion cancelled")
            return False
        
        try:
            # Delete user (translations will be deleted automatically due to cascade)
            db.session.delete(user)
            db.session.commit()
            
            print(f"\n✅ User {user.email} deleted successfully!")
            print(f"   - Deleted {translation_count} translations")
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error deleting user: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

def list_users():
    """List all users"""
    with app.app_context():
        users = User.query.order_by(User.created_at.desc()).all()
        
        if not users:
            print("No users found")
            return
        
        print(f"\n📋 All Users ({len(users)} total):")
        print("-" * 80)
        print(f"{'Email':<40} {'Name':<20} {'Provider':<10} {'Verified':<10} {'Created'}")
        print("-" * 80)
        
        for user in users:
            verified = "✅" if user.email_verified else "❌"
            name = user.name or "-"
            print(f"{user.email:<40} {name:<20} {user.provider:<10} {verified:<10} {user.created_at.strftime('%Y-%m-%d %H:%M')}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python delete_user.py <email>")
        print("   or: python delete_user.py --list")
        print("\nExamples:")
        print("  python delete_user.py user@example.com")
        print("  python delete_user.py --list")
        sys.exit(1)
    
    if sys.argv[1] == '--list':
        list_users()
    else:
        email = sys.argv[1]
        delete_user(email)

