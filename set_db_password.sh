#!/bin/bash
# Helper script to set PostgreSQL database password

echo "🔐 PostgreSQL Password Setup"
echo "============================"
echo ""
echo "This script will help you set your PostgreSQL password."
echo ""

# Get password from user
read -sp "Enter your PostgreSQL password: " DB_PASSWORD
echo ""
echo ""

# Get username (default to postgres)
read -p "Enter PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

# Set other defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-translation_app}

# Export variables
export DB_USER
export DB_PASSWORD
export DB_HOST
export DB_PORT
export DB_NAME

echo "✅ Environment variables set!"
echo ""
echo "📋 Current settings:"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   Password: [hidden]"
echo ""
echo "🚀 Now you can run:"
echo "   python init_database.py"
echo ""
echo "💡 To make this permanent, add these to your ~/.zshrc:"
echo "   export DB_USER=$DB_USER"
echo "   export DB_PASSWORD=$DB_PASSWORD"
echo "   export DB_HOST=$DB_HOST"
echo "   export DB_PORT=$DB_PORT"
echo "   export DB_NAME=$DB_NAME"

