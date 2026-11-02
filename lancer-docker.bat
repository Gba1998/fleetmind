@echo off
title FleetMind - Deploiement Docker Production
color 0E

echo =========================================================================
echo               FLEETMIND - DEPLOIEMENT CONTENEURISE (DOCKER)
echo =========================================================================
echo.
echo Verification de Docker...

docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Docker n'est pas installe ou Docker Desktop n'est pas demarre.
    echo Veuillez installer ou lancer Docker Desktop pour executer ce script.
    echo.
    echo Alternative : Utilisez "lancer-fleetmind.bat" pour le demarrage local.
    pause
    exit /b 1
)

echo [OK] Docker detecte. Construction et lancement des conteneurs FleetMind...
echo.
docker compose up -d --build

echo.
echo =========================================================================
echo [SUCCES] FleetMind est operationnel en conteneurs Docker !
echo.
echo - Frontend Web (Nginx) : http://localhost (ou http://localhost:5173)
echo - Backend API REST     : http://localhost:5000/api/health
echo.
echo Pour arreter les conteneurs : docker compose down
echo =========================================================================
echo.
pause
