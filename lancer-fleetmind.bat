@echo off
title FleetMind Launcher
echo ========================================================
echo         LANCEMENT DE LA PLATEFORME FLEETMIND
echo ========================================================
echo.
echo 1/2 Demarrage du serveur Backend (Port 5000)...
start "FleetMind Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 2 /nobreak >nul

echo 2/2 Demarrage du serveur Frontend (Port 5173)...
start "FleetMind Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo Les serveurs sont lances !
echo - Application Web : http://localhost:5173
echo - API REST Backend : http://localhost:5000/api/health
echo.
echo Compte test : sinan@fleetmind.io
echo Mot de passe : fleetmind2026
echo ========================================================
echo.
pause
