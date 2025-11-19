#!/bin/bash
# Quick Database Setup Script
# Run this once database connection is working

echo "=========================================="
echo "Database Setup Script"
echo "=========================================="
echo ""

# Step 1: Test Connection
echo "Step 1: Testing database connection..."
node setup-database.js
if [ $? -ne 0 ]; then
    echo "❌ Connection failed. Please check database settings."
    exit 1
fi

echo ""
echo "Step 2: Creating database schema..."
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "❌ Migration failed."
    exit 1
fi

echo ""
echo "Step 3: Seeding database with initial data..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Seed failed."
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Database setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Visit: http://localhost:3000"
echo "2. Test surveys: /survey/staff-questionnaire?lang=en"
echo "3. Admin panel: /admin/questionnaires"

