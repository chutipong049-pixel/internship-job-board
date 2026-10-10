@echo off
chcp 65001 > nul
title Internship Job Board - Backend (NestJS)
echo ========================================================
echo   🚀 กำลังเริ่มต้นระบบหลังบ้าน (NestJS Backend API)
echo ========================================================

set "PATH=C:\Program Files\nodejs;C:\Program Files\PostgreSQL\16\bin;%PATH%"
cd /d "%~dp0backend"

echo.
echo [1/3] ตรวจสอบโครงสร้างฐานข้อมูล (Prisma)...
call npx prisma db push --skip-generate
if %ERRORLEVEL% NEQ 0 (
  echo ⚠️ ไม่สามารถเชื่อมต่อ PostgreSQL ได้ กรุณาตรวจสอบว่า PostgreSQL หรือ Docker รันอยู่
)

echo.
echo [2/3] นำเข้าข้อมูลตัวอย่าง (Seeding Companies & Jobs)...
call npx prisma db seed

echo.
echo [3/3] รันเซิร์ฟเวอร์ Backend (Port 3000)...
echo เซิร์ฟเวอร์จะเปิดที่: http://localhost:3000/api
echo.
npm run start:dev
pause
