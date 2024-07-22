#!/bin/bash

# Database setup script for Decentralized File Storage

set -e

echo "🗄️  Setting up PostgreSQL database for Decentralized File Storage..."

# Default values
DB_NAME="decentralized_storage"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
createdb $DB_NAME -U $DB_USER -h $DB_HOST -p $DB_PORT 2>/dev/null || echo "Database already exists"

# Set environment variable
export DATABASE_URL="postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

echo "✅ Database setup complete!"
echo "DATABASE_URL: $DATABASE_URL"
echo ""
echo "Next steps:"
echo "1. Copy backend/.env.example to backend/.env"
echo "2. Update DATABASE_URL in backend/.env"
echo "3. Run 'cd backend && cargo run' to start the backend server"