@echo off
title Servidor - Simulador de Copa
echo ==========================================
echo Iniciando o Simulador de Copa do Mundo...
echo ==========================================
echo.
echo O navegador abrira automaticamente.
echo Para desligar o simulador, basta fechar esta janela do terminal.
echo.

:: Abre o navegador padrao direto no localhost
start http://localhost:8000

:: Inicia o servidor Python
python -m http.server

pause