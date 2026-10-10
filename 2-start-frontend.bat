@echo off
chcp 65001 > nul
title Internship Job Board - Frontend (Angular)
echo ========================================================
echo   💻 กำลังเริ่มต้นระบบหน้าเว็บ (Angular Frontend)
echo ========================================================

set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0frontend"

echo.
echo กำลังเปิดเซิร์ฟเวอร์หน้าเว็บ...
echo เมื่อพร้อม หน้าเว็บจะเปิดที่: http://localhost:4200
echo.

start "" "http://localhost:4200"
npm start
pause
