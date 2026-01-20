#!/usr/bin/env python3
"""
Database initialization script for Translation App
Run this script to create the database and tables
"""

import os
from app import app, db

def init_database():
    """Initialize the database and create tables"""
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            print(f"✅ Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Tables created: {', '.join(tables)}")
            
        except Exception as e:
            print(f"❌ Error creating database: {str(e)}")
            print("\n💡 Make sure PostgreSQL is running and the database exists.")
            print("💡 Create the database first:")
            print("   createdb translation_app")
            return False
    
    return True

if __name__ == '__main__':
    print("🚀 Initializing Translation App Database...")
    print("-" * 50)
    
    if init_database():
        print("-" * 50)
        print("✅ Database initialization complete!")
    else:
        print("-" * 50)
        print("❌ Database initialization failed!")
        exit(1)

