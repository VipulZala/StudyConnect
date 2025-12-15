@echo off
color 0E
echo ========================================
echo   Starting StudyConnect Application
echo ========================================
echo.
echo This will start both:
echo   1. Backend Server (Port 5000)
echo   2. Frontend Server (Port 5173)
echo.
echo Two terminal windows will open...
echo.
timeout /t 2 /nobreak >nul

REM Start backend in new window
start "StudyConnect Backend" cmd /k "cd /d "%~dp0backend" && start-backend.bat"

REM Wait 3 seconds for backend to initialize
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "StudyConnect Frontend" cmd /k "cd /d "%~dp0" && start-frontend.bat"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Keep both terminal windows open while working.
echo Close them when you're done.
echo.
echo This window will close in 5 seconds...
timeout /t 5 /nobreak >nul
