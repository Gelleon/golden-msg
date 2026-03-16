@echo off
setlocal enabledelayedexpansion

echo Запуск PowerShell скрипта...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy.ps1"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Скрипт завершился с ошибкой %errorlevel%.
    pause
)
