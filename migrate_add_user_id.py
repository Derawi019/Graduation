#!/usr/bin/env python3
"""
Migration script to add user_id column to translations table
Run this script to update the database schema for authentication
"""

import os
from app import app, db
from sqlalchemy import text, inspect

def migrate_add_user_id():
    """Add user_id column to translations table"""
    with app.app_context():
        try:
            # Check if user_id column already exists
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('translations')]
            
            if 'user_id' in columns:
                print("✅ user_id column already exists in translations table")
                return True
            
            print("🔄 Adding user_id column to translations table...")
            
            # Check if there are any existing translations
            result = db.session.execute(text("SELECT COUNT(*) FROM translations"))
            translation_count = result.scalar()
            print(f"📊 Found {translation_count} existing translations")
            
            # Get the first user (or create a default user if none exists)
            from app import User
            first_user = User.query.first()
            
            if translation_count > 0:
                if not first_user:
                    print("⚠️  No users found, but translations exist.")
                    print("⚠️  Creating a default user for existing translations...")
                    # Create a default user
                    default_user = User(
                        email='default@example.com',
                        name='Default User',
                        provider='local'
                    )
                    default_user.set_password('default_password_change_me')
                    db.session.add(default_user)
                    db.session.commit()
                    first_user = default_user
                    print(f"✅ Created default user: {default_user.email}")
                
                print(f"📝 Assigning existing translations to user: {first_user.email}")
            
            # Step 1: Add user_id column (nullable first)
            print("Step 1: Adding user_id column (nullable)...")
            db.session.execute(text("""
                ALTER TABLE translations 
                ADD COLUMN user_id INTEGER
            """))
            db.session.commit()
            print("✅ user_id column added (nullable)")
            
            # Step 2: Update existing translations to point to first user
            if translation_count > 0 and first_user:
                print(f"Step 2: Updating {translation_count} existing translations...")
                db.session.execute(text("""
                    UPDATE translations 
                    SET user_id = :user_id 
                    WHERE user_id IS NULL
                """), {'user_id': first_user.id})
                db.session.commit()
                print(f"✅ Updated {translation_count} translations to user {first_user.email}")
            
            # Step 3: Add foreign key constraint
            print("Step 3: Adding foreign key constraint...")
            try:
                db.session.execute(text("""
                    ALTER TABLE translations 
                    ADD CONSTRAINT fk_translations_user_id 
                    FOREIGN KEY (user_id) 
                    REFERENCES users(id) 
                    ON DELETE CASCADE
                """))
                db.session.commit()
                print("✅ Foreign key constraint added")
            except Exception as e:
                # Constraint might already exist
                if 'already exists' in str(e).lower() or 'duplicate' in str(e).lower():
                    print("ℹ️  Foreign key constraint already exists")
                else:
                    print(f"⚠️  Could not add foreign key constraint: {e}")
            
            # Step 4: Make user_id NOT NULL and add index
            print("Step 4: Making user_id NOT NULL and adding index...")
            try:
                # Make user_id NOT NULL
                db.session.execute(text("""
                    ALTER TABLE translations 
                    ALTER COLUMN user_id SET NOT NULL
                """))
                db.session.commit()
                print("✅ user_id is now NOT NULL")
            except Exception as e:
                print(f"⚠️  Could not make user_id NOT NULL: {e}")
                print("ℹ️  This is okay if there are NULL values (shouldn't happen)")
            
            # Add index if it doesn't exist
            try:
                db.session.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_translations_user_id 
                    ON translations(user_id)
                """))
                db.session.commit()
                print("✅ Index on user_id added")
            except Exception as e:
                print(f"ℹ️  Index might already exist: {e}")
            
            print("\n✅ Migration completed successfully!")
            print("✅ translations table now has user_id column")
            
            # Verify the migration
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('translations')]
            if 'user_id' in columns:
                print(f"✅ Verification: user_id column exists")
                return True
            else:
                print("❌ Verification failed: user_id column not found")
                return False
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    print("🚀 Starting migration: Add user_id to translations table")
    print("-" * 60)
    
    if migrate_add_user_id():
        print("-" * 60)
        print("✅ Migration completed successfully!")
    else:
        print("-" * 60)
        print("❌ Migration failed!")
        exit(1)

