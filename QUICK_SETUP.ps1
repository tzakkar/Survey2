# Quick Database Setup Script (PowerShell)
# Run this once database connection is working

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Database Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Test Connection
Write-Host "Step 1: Testing database connection..." -ForegroundColor Yellow
node setup-database.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Connection failed. Please check database settings." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating database schema..." -ForegroundColor Yellow
npm run db:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Seeding database with initial data..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Seed failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit: http://localhost:3000"
Write-Host "2. Test surveys: /survey/staff-questionnaire?lang=en"
Write-Host "3. Admin panel: /admin/questionnaires"

