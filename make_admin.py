#!/usr/bin/env python3
"""
Script to make a user an admin
Usage: python make_admin.py
"""

import os
import sys

# Add parent directory to path to import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db
    from app import User
except ImportError as e:
    print(f"❌ Error importing app: {e}")
    print("\n💡 Make sure you're in the virtual environment:")
    print("   source venv/bin/activate")
    sys.exit(1)

def make_admin(email=None):
    """Make a user an admin"""
    with app.app_context():
        try:
            # Check if is_admin column exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('users')]
            
            if 'is_admin' not in columns:
                print("❌ Error: 'is_admin' column does not exist in 'users' table")
                print("💡 Please run the migration first:")
                print("   python migrate_add_admin_field.py")
                return False
            
            # Get email from command line argument or user input
            if not email:
                try:
                    email = input("Enter email address to make admin: ").strip()
                except EOFError:
                    print("❌ Error: No email provided and cannot read from stdin")
                    print("💡 Usage: python make_admin.py <email>")
                    print("\n💡 Available users:")
                    all_users = User.query.all()
                    for u in all_users:
                        print(f"   - {u.email}")
                    return False
            
            if not email:
                print("❌ Email address cannot be empty")
                return False
            
            # Find user
            user = User.query.filter_by(email=email).first()
            
            if not user:
                print(f"❌ User with email '{email}' not found")
                print("\n💡 Available users:")
                all_users = User.query.all()
                for u in all_users[:10]:  # Show first 10
                    print(f"   - {u.email}")
                if len(all_users) > 10:
                    print(f"   ... and {len(all_users) - 10} more")
                return False
            
            # Make admin
            user.is_admin = True
            db.session.commit()
            
            print(f"✅ Success! {email} is now an admin")
            print(f"   Name: {user.name or user.username or 'N/A'}")
            print(f"   Admin status: {user.is_admin}")
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    print("🚀 Make User Admin")
    print("=" * 60)
    
    # Get email from command line argument if provided
    email = None
    if len(sys.argv) > 1:
        email = sys.argv[1].strip()
    
    if make_admin(email):
        print("=" * 60)
        print("✅ Done! The user can now access the admin dashboard.")
        print("💡 User should log out and log back in to see admin button.")
    else:
        print("=" * 60)
        print("❌ Failed to make user admin")
        sys.exit(1)

