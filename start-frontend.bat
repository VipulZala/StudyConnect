@echo off
title StudyConnect Frontend
color 0B
echo ========================================
echo   StudyConnect Frontend
echo ========================================
echo.
echo Starting frontend server on port 5173...
echo Browser will open automatically...
echo.

cd /d "%~dp0"
npm run dev
