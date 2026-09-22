@echo off
chcp 65001 >nul
title Previa no celular - Gloria Festas
cd /d "%~dp0"
set IP=
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do if not defined IP set IP=%%a
set IP=%IP: =%
echo.
echo  ============================================================
echo   No celular, na mesma internet da casa, abra este endereco:
echo.
echo        http://%IP%:8085/?animacao
echo.
echo   Deixe esta janela aberta enquanto estiver vendo o site.
echo   Para desligar, feche esta janela.
echo  ============================================================
echo.
node "_trabalho\tools\serve.mjs" "%~dp0gloriafestas" 8085 0.0.0.0
pause
