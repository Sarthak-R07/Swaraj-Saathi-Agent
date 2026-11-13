@echo off
title Swaraj Saathi - Stopping...
color 0C

echo.
echo  ============================================
echo       Swaraj Saathi - Shutdown
echo  ============================================
echo.

echo  Stopping Backend (port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo        Done.

echo  Stopping Frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo        Done.

echo.
echo  ============================================
echo    All Swaraj Saathi services stopped.
echo  ============================================
echo.
pause
