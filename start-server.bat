@echo off
setlocal
cd /d "%~dp0"
TITLE SI.MA Dev Server
echo ==============================
echo   AVVIO DEV SERVER SI.MA
echo   Porta: 5174  LiveReload: 35729
echo   Chiudi questa finestra per fermare
echo ==============================
python devserver.py
endlocal
