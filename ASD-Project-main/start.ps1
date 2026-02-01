# Start the ASD Project - Both Backend and Frontend
Write-Host "Starting ASD Project..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Start Backend
Write-Host "`nStarting Backend Server (FastAPI)..." -ForegroundColor Cyan
$backendPath = "f:\ASD-Project-main\ASD-Project-main\backend"
Start-Process -FilePath "$backendPath\.venv\Scripts\python.exe" -ArgumentList "server.py" -WorkingDirectory $backendPath -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend Server (React)..." -ForegroundColor Cyan
$frontendPath = "f:\ASD-Project-main\ASD-Project-main\frontend"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d $frontendPath && npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Project Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nBackend API:   http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Docs:      http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Frontend:      http://localhost:3000" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C in either window to stop the services." -ForegroundColor Cyan
