#!/usr/bin/env python3
"""
Migration script to add email verification and password reset fields to users table
Run this script to update the database schema for email verification
"""

import os
from app import app, db
from sqlalchemy import text, inspect

def migrate_add_email_fields():
    """Add email verification and password reset fields to users table"""
    with app.app_context():
        try:
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('users')]
            
            print("🔄 Adding email verification and password reset fields...")
            
            # Check and add email_verified column
            if 'email_verified' not in columns:
                print("Step 1: Adding email_verified column...")
                db.session.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL
                """))
                db.session.commit()
                
                # Set existing users as verified (for backward compatibility)
                db.session.execute(text("""
                    UPDATE users 
                    SET email_verified = TRUE 
                    WHERE provider = 'google' OR email_verified IS NULL
                """))
                db.session.commit()
                print("✅ email_verified column added (existing users set to verified)")
            else:
                print("ℹ️  email_verified column already exists")
            
            # Check and add verification_token column
            if 'verification_token' not in columns:
                print("Step 2: Adding verification_token column...")
                db.session.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN verification_token VARCHAR(100)
                """))
                db.session.commit()
                print("✅ verification_token column added")
            else:
                print("ℹ️  verification_token column already exists")
            
            # Check and add verification_token_expires column
            if 'verification_token_expires' not in columns:
                print("Step 3: Adding verification_token_expires column...")
                db.session.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN verification_token_expires TIMESTAMP
                """))
                db.session.commit()
                print("✅ verification_token_expires column added")
            else:
                print("ℹ️  verification_token_expires column already exists")
            
            # Check and add reset_token column
            if 'reset_token' not in columns:
                print("Step 4: Adding reset_token column...")
                db.session.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_token VARCHAR(100)
                """))
                db.session.commit()
                print("✅ reset_token column added")
            else:
                print("ℹ️  reset_token column already exists")
            
            # Check and add reset_token_expires column
            if 'reset_token_expires' not in columns:
                print("Step 5: Adding reset_token_expires column...")
                db.session.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN reset_token_expires TIMESTAMP
                """))
                db.session.commit()
                print("✅ reset_token_expires column added")
            else:
                print("ℹ️  reset_token_expires column already exists")
            
            # Add indexes for better performance
            print("Step 6: Adding indexes...")
            try:
                db.session.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_users_verification_token 
                    ON users(verification_token)
                """))
                db.session.commit()
                print("✅ Index on verification_token added")
            except Exception as e:
                print(f"ℹ️  Index on verification_token might already exist: {e}")
            
            try:
                db.session.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_users_reset_token 
                    ON users(reset_token)
                """))
                db.session.commit()
                print("✅ Index on reset_token added")
            except Exception as e:
                print(f"ℹ️  Index on reset_token might already exist: {e}")
            
            print("\n✅ Migration completed successfully!")
            
            # Verify the migration
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('users')]
            required_fields = ['email_verified', 'verification_token', 'verification_token_expires', 'reset_token', 'reset_token_expires']
            missing_fields = [field for field in required_fields if field not in columns]
            
            if not missing_fields:
                print("✅ Verification: All required fields exist")
                return True
            else:
                print(f"❌ Verification failed: Missing fields: {', '.join(missing_fields)}")
                return False
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    print("🚀 Starting migration: Add email verification fields to users table")
    print("-" * 60)
    
    if migrate_add_email_fields():
        print("-" * 60)
        print("✅ Migration completed successfully!")
    else:
        print("-" * 60)
        print("❌ Migration failed!")
        exit(1)

