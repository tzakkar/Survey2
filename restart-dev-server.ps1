# Restart Next.js Dev Server Script
Write-Host "🛑 Stopping any running Next.js processes on port 3000..." -ForegroundColor Yellow

# Kill processes on port 3000
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $processes) {
    if ($pid) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "   Stopped process $pid" -ForegroundColor Gray
    }
}

Start-Sleep -Seconds 2

Write-Host "`n🧹 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✅ Cleared .next folder" -ForegroundColor Green
} else {
    Write-Host "   .next folder doesn't exist" -ForegroundColor Gray
}

Write-Host "`n🚀 Starting dev server..." -ForegroundColor Green
Write-Host "   Run: npm run dev" -ForegroundColor Cyan
Write-Host "`n   Then open: http://localhost:3000" -ForegroundColor Cyan

