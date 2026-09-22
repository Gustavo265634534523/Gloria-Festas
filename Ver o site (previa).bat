@echo off
chcp 65001 >nul
title Previa do site - Gloria Festas
cd /d "%~dp0"
echo.
echo  Ligando a previa do site da Gloria Festas...
echo  Deixe esta janela aberta enquanto olha o site.
echo.
start "" /b node "_trabalho\tools\serve.mjs" "%~dp0gloriafestas" 8080
timeout /t 2 /nobreak >nul
start "" "http://localhost:8080/?animacao"
echo  O site abriu no navegador: http://localhost:8080/?animacao
echo.
echo  Para desligar a previa, feche esta janela.
pause >nul
