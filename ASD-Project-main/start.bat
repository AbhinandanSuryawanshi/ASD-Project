@echo off
REM Simple batch script to start both servers
Title ASD Detection System - Start

echo.
echo ========================================
echo    ASD Detection System Starting
echo ========================================
echo.

REM Kill any existing processes
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

echo.
echo [1/2] Starting Backend Server...
echo.
cd /d F:\ASD-Project-main\ASD-Project-main\backend
start "Backend Server" "%~dp0backend\.venv\Scripts\python.exe" "server.py"

timeout /t 3 /nobreak

echo.
echo [2/2] Starting Frontend Server...
echo.
cd /d F:\ASD-Project-main\ASD-Project-main\frontend
call npm start

pause
