#!/bin/bash

# ==============================================================================
# Скрипт деплоя на сервере (выполняется удаленно)
# ==============================================================================

set -e

PROJECT_DIR="/var/www/golden-msg"
WEB_DIR="$PROJECT_DIR/web"

echo "--- Начинаю обновление проекта на сервере ---"

# 1. Обновление кода из Git
cd "$PROJECT_DIR"
echo ">>> Подтягивание последних изменений из GitHub..."
git pull origin main

# 2. Установка зависимостей и сборка
cd "$WEB_DIR"
echo ">>> Установка npm зависимостей..."
npm install

echo ">>> Генерация Prisma клиента..."
npx prisma generate
npx prisma migrate deploy

echo ">>> Сборка Next.js приложения..."
npm run build

# 3. Перезапуск приложения через PM2
echo ">>> Перезапуск процесса в PM2..."
if pm2 show golden-msg > /dev/null; then
    pm2 restart golden-msg
else
    pm2 start npm --name "golden-msg" -- start
fi

echo "--- Деплой успешно завершен! ---"
