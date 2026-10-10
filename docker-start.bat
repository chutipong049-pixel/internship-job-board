@echo off
chcp 65001 > nul
title Internship Job Board - Docker All-in-One
echo ========================================================
echo   🐳 กำลังเริ่มต้นระบบด้วย Docker (Full-Stack)
echo ========================================================
echo   - PostgreSQL (Database) : Port 5432
echo   - NestJS API (Backend)  : Port 3000
echo   - Angular Web (Frontend): Port 4200
echo ========================================================
echo.

cd /d "%~dp0"

echo กำลัง Build และ Start Docker Containers...
docker compose up -d --build

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ❌ เกิดข้อผิดพลาด กรุณาตรวจสอบว่า Docker Desktop เปิดอยู่หรือไม่
  pause
  exit /b %ERRORLEVEL%
)

echo.
echo ✅ ระบบทั้งหมดกำลังรันใน Docker แล้ว!
echo 🌐 กำลังเปิดหน้าเว็บ: http://localhost:4200
echo 📚 ตรวจสอบ Backend API ได้ที่: http://localhost:3000/api
echo.
timeout /t 3 > nul
start "" "http://localhost:4200"

echo กดปุ่มใดๆ เพื่อดูสถานะ Container...
docker compose ps
echo.
echo (หากต้องการหยุดระบบ ให้ดับเบิลคลิกไฟล์ docker-stop.bat หรือพิมพ์ docker compose down)
pause
