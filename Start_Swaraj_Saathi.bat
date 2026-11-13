@echo off
title Swaraj Saathi Kendra Agent Dashboard
color 0A

echo =======================================================================
echo            SWARAJ SAATHI - KENDRA OPERATOR DASHBOARD
echo                     [1-Click Desktop Launcher]
echo =======================================================================
echo.

set "PROJECT_DIR=%~dp0"
set "BACKEND_DIR=%PROJECT_DIR%backend"
set "FRONTEND_DIR=%PROJECT_DIR%frontend"
set "VENV_PYTHON=%BACKEND_DIR%\venv\Scripts\python.exe"
set "BROWSER_URL=http://localhost:5173"
set "BACKEND_PORT=8000"
set "FRONTEND_PORT=5173"

:: 1. Check & start Backend on port 8000
echo [*] Step 1/3: Checking Backend Engine on port %BACKEND_PORT%...
netstat -ano | findstr :%BACKEND_PORT% | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend is already active and listening on port %BACKEND_PORT%.
) else (
    echo [*] Starting Kendra AI Backend on port %BACKEND_PORT%...
    start "Swaraj Backend (Port 8000)" cmd /k "cd /d "%BACKEND_DIR%" && "%VENV_PYTHON%" -m uvicorn server:app --host 0.0.0.0 --port %BACKEND_PORT%"
    ping 127.0.0.1 -n 3 >nul
    echo [OK] Backend initialized!
)

:: 2. Check & start Frontend on port 5173
echo [*] Step 2/3: Checking React Dashboard on port %FRONTEND_PORT%...
netstat -ano | findstr :%FRONTEND_PORT% | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dashboard frontend is already active on port %FRONTEND_PORT%.
) else (
    echo [*] Starting Vite Frontend on port %FRONTEND_PORT%...
    start "Swaraj Frontend (Port 5173)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev -- --port %FRONTEND_PORT%"
    ping 127.0.0.1 -n 4 >nul
    echo [OK] Frontend initialized!
)

:: 3. Launch Default Browser
echo [*] Step 3/3: Opening Agent Dashboard in browser (%BROWSER_URL%)...
start "" "%BROWSER_URL%"

echo.
echo =======================================================================
echo   Swaraj Saathi Agent Dashboard is now running!
echo.
echo   URL: %BROWSER_URL%
echo   Login Mobile: 9876543210  (Demo OTP: 1234)
echo.
echo   [Features]
echo   - Aadhaar Smart OCR: Real-time OCR via Tesseract (Zero predefined data)
echo   - 1-Click Photo Resizer: Auto under 50KB and under 100KB MahaDBT presets
echo   - AI Assistant and Scheme Matcher: Vernacular Marathi and English
echo =======================================================================
echo.
echo You can minimize this window.
pause >nul
