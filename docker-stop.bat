@echo off
chcp 65001 > nul
title Internship Job Board - Stop Docker
echo ========================================================
echo   🛑 กำลังหยุดและลบ Docker Containers
echo ========================================================
echo.

cd /d "%~dp0"
docker compose down

echo.
echo ✅ หยุดการทำงานของ Containers เรียบร้อยแล้ว!
pause
