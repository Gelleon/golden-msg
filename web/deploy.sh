#!/bin/bash
set -e

PROJECT_DIR="/var/www/golden-msg"
WEB_DIR="$PROJECT_DIR/web"

echo "--- Начинаю обновление проекта на сервере ---"

# 1. Обновление кода из Git
cd "$PROJECT_DIR"
echo ">>> Сброс локальных изменений на сервере (очистка сгенерированных файлов)..."
git reset --hard
echo ">>> Подтягивание последних изменений из GitHub..."
git pull origin main

# 2. Установка зависимостей и сборка
cd "$WEB_DIR"
set -a
[ -f "$WEB_DIR/.env" ] && . "$WEB_DIR/.env"
set +a

if [ -n "$DATABASE_URL" ]; then
    echo ">>> DATABASE_URL загружен из .env"
else
    echo ">>> DATABASE_URL не найден в .env"
fi

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
    pm2 restart golden-msg --update-env
else
    pm2 start npm --name "golden-msg" --cwd "$WEB_DIR" -- start
fi

echo "--- Деплой успешно завершен! ---"
