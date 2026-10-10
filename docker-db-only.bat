@echo off
chcp 65001 > nul
title Internship Job Board - Docker DB Only
echo ========================================================
echo   🐘 กำลังเปิด PostgreSQL Database ผ่าน Docker
echo ========================================================
echo   - PostgreSQL Port: 5432
echo   - Database: jobboard_db
echo ========================================================
echo.

cd /d "%~dp0"
docker compose up -d postgres

if %ERRORLEVEL% NEQ 0 (
  echo ❌ เกิดข้อผิดพลาด กรุณาตรวจสอบว่า Docker Desktop เปิดอยู่หรือไม่
  pause
  exit /b %ERRORLEVEL%
)

echo.
echo ✅ PostgreSQL Database พร้อมใช้งานแล้ว!
echo คุณสามารถรัน backend และ frontend ได้ตามปกติผ่าน start-all.bat
pause
