@echo off
chcp 65001 > nul
title Internship Job Board - Launcher
echo ========================================================
echo   🌟 ยินดีต้อนรับสู่ระบบ Internship & Job Board
echo ========================================================
echo.
echo กำลังเปิดเซิร์ฟเวอร์ Backend และ Frontend ให้พร้อมกัน...
echo.

start "Backend Server" cmd /k "call \"%~dp01-start-backend.bat\""
timeout /t 5 > nul
start "Frontend Server" cmd /k "call \"%~dp02-start-frontend.bat\""

echo.
echo ✅ สั่งเปิดหน้าต่าง Backend (พอร์ต 3000) และ Frontend (พอร์ต 4200) เรียบร้อยแล้ว!
echo คุณสามารถปิดหน้าต่างนี้ได้เลย
pause
