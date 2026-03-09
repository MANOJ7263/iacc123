@echo off
echo ==========================================
echo   DISTRICT-IACC AUTO-PILOT LAUNCHER
echo ==========================================
echo.

echo [1/3] Starting Backend Server (Spring Boot)...
start "IACC Backend" cmd /k "cd BACK_END\iacc && mvnw spring-boot:run"

echo [2/3] Starting Frontend Server (React)...
start "IACC Frontend" cmd /k "cd FRONT_END\iacc && npm run dev"

echo [3/3] Launching Browser...
timeout /t 10 /nobreak >nul
start http://localhost:5173

echo.
echo ==========================================
echo   SYSTEM LAUNCHED SUCCESSFULLY
echo ==========================================
echo.
pause
