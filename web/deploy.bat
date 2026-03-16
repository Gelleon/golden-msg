@echo off
setlocal enabledelayedexpansion
chcp 1251 >nul
echo ========================================
echo   ЗАПУСК ПОЛНОГО ЦИКЛА ДЕПЛОЯ
echo ========================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy.ps1"
if %errorlevel% neq 0 (
    echo.
    echo [!] Скрипт завершился с ошибкой.
    pause
)
