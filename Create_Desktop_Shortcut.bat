@echo off
title Creating Desktop Shortcut for Swaraj Saathi Dashboard...
color 0A

echo.
echo ========================================================
echo   Creating Desktop Shortcut for Swaraj Saathi Dashboard
echo ========================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0create_shortcut.ps1"

echo.
echo  [DONE] Shortcut "Swaraj Saathi Agent Dashboard" created on your Desktop!
echo  Double-click it anytime on your laptop to start both backend & dashboard.
echo.
pause
