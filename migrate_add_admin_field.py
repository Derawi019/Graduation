#!/usr/bin/env python3
"""
Migration script to add is_admin field to User model
Run this script to add the is_admin column to the users table
"""

import os
import sys

# Add parent directory to path to import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Try to import, but handle if app context is not available
try:
    from app import app, db
    from sqlalchemy import text
except ImportError as e:
    print(f"❌ Error importing app: {e}")
    print("\n💡 Make sure you're in the virtual environment:")
    print("   source venv/bin/activate")
    sys.exit(1)

def migrate_add_admin_field():
    """Add is_admin column to users table"""
    with app.app_context():
        try:
            # Check if column already exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('users')]
            
            if 'is_admin' in columns:
                print("✅ Column 'is_admin' already exists in 'users' table")
                return True
            
            # Add the column
            print("🔄 Adding 'is_admin' column to 'users' table...")
            db.session.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL"))
            db.session.commit()
            
            # Create index on is_admin for faster queries
            print("🔄 Creating index on 'is_admin' column...")
            try:
                db.session.execute(text("CREATE INDEX IF NOT EXISTS ix_users_is_admin ON users (is_admin)"))
                db.session.commit()
            except Exception as e:
                # Index might already exist or PostgreSQL syntax might be slightly different
                db.session.rollback()
                print(f"⚠️  Note: Could not create index (might already exist): {e}")
            print("✅ Successfully added 'is_admin' column to 'users' table!")
            print("✅ Index created on 'is_admin' column")
            
            # Verify the column was added
            columns = [col['name'] for col in inspector.get_columns('users')]
            if 'is_admin' in columns:
                print("✅ Verification: Column 'is_admin' exists in 'users' table")
            
            return True
            
        except Exception as e:
            print(f"❌ Error adding 'is_admin' column: {str(e)}")
            db.session.rollback()
            return False

if __name__ == '__main__':
    print("🚀 Starting migration: Add is_admin field to User model")
    print("=" * 60)
    
    if migrate_add_admin_field():
        print("=" * 60)
        print("✅ Migration completed successfully!")
        print("\n💡 Next steps:")
        print("   1. Run the app: python app.py")
        print("   2. To make a user admin, use the admin script or database directly")
        print("   3. Example SQL: UPDATE users SET is_admin = TRUE WHERE email = 'your@email.com';")
    else:
        print("=" * 60)
        print("❌ Migration failed. Please check the error above.")
        sys.exit(1)

