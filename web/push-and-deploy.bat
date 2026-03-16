@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: Скрипт локального пуша и деплоя на сервер
:: ==============================================================================

set SERVER_IP=217.26.27.86
set SERVER_USER=root
set SERVER_PATH=/var/www/golden-msg/web
set COMMIT_MSG=auto-deploy-at-%date%-%time%

echo --- 1. Сохранение изменений в GitHub ---
git add .
git commit -m "%COMMIT_MSG%"
git push origin main

if %errorlevel% neq 0 (
    echo [ERROR] Ошибка при пуше в GitHub. Деплой остановлен.
    pause
    exit /b %errorlevel%
)

echo.
echo --- 2. Запуск деплоя на сервере по SSH ---
:: Выполнение команды на сервере: переход в папку и запуск скрипта deploy.sh
ssh %SERVER_USER%@%SERVER_IP% "bash %SERVER_PATH%/deploy.sh"

if %errorlevel% neq 0 (
    echo [ERROR] Ошибка при выполнении деплоя на сервере.
    pause
    exit /b %errorlevel%
)

echo.
echo --- ВСЕ ГОТОВО! Проект обновлен на сервере. ---
pause
