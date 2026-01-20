#!/bin/bash
# Script to add database environment variables to ~/.zshrc

echo "🔐 Adding Database Configuration to ~/.zshrc"
echo "=============================================="
echo ""

# Check if variables already exist
if grep -q "DB_PASSWORD" ~/.zshrc 2>/dev/null; then
    echo "⚠️  Database variables already exist in ~/.zshrc"
    read -p "Do you want to update them? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. No changes made."
        exit 0
    fi
    # Remove old entries
    sed -i.bak '/# Translation App Database/d' ~/.zshrc
    sed -i.bak '/export DB_/d' ~/.zshrc
    sed -i.bak '/^$/N;/^\n$/d' ~/.zshrc
fi

# Get password from user
echo "Enter your PostgreSQL password:"
read -sp "Password: " DB_PASSWORD
echo ""
echo ""

# Get username (default to postgres)
read -p "PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

# Get database name (default to translation_app)
read -p "Database name [translation_app]: " DB_NAME
DB_NAME=${DB_NAME:-translation_app}

# Get host (default to localhost)
read -p "Database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

# Get port (default to 5432)
read -p "Database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Append to ~/.zshrc
echo "" >> ~/.zshrc
echo "# Translation App Database Configuration" >> ~/.zshrc
echo "export DB_USER=\"$DB_USER\"" >> ~/.zshrc
echo "export DB_PASSWORD=\"$DB_PASSWORD\"" >> ~/.zshrc
echo "export DB_HOST=\"$DB_HOST\"" >> ~/.zshrc
echo "export DB_PORT=\"$DB_PORT\"" >> ~/.zshrc
echo "export DB_NAME=\"$DB_NAME\"" >> ~/.zshrc

echo "✅ Database configuration added to ~/.zshrc!"
echo ""
echo "📋 Added variables:"
echo "   DB_USER=$DB_USER"
echo "   DB_PASSWORD=[hidden]"
echo "   DB_HOST=$DB_HOST"
echo "   DB_PORT=$DB_PORT"
echo "   DB_NAME=$DB_NAME"
echo ""
echo "🔄 Reloading ~/.zshrc..."
source ~/.zshrc

echo ""
echo "✅ Done! Your database configuration is now permanent."
echo "   You can now run './run.sh' without setting variables each time."
echo ""

