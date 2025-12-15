@echo off
title StudyConnect Backend Server
color 0A
echo ========================================
echo   StudyConnect Backend Server
echo ========================================
echo.
echo Starting backend server on port 5000...
echo.

cd /d "%~dp0"
npm run dev
