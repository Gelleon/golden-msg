#!/bin/bash
set -e

PROJECT_DIR="/var/www/golden-msg"
WEB_DIR="$PROJECT_DIR/web"
ROOT_DB="$WEB_DIR/.dev.db"
PRISMA_DB="$WEB_DIR/prisma/.dev.db"

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

KEY_FILE="$WEB_DIR/.next-server-actions.key"
if [ -z "$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY" ]; then
    if [ -f "$KEY_FILE" ]; then
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$(tr -d '\r\n' < "$KEY_FILE")
    else
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
        echo "$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY" > "$KEY_FILE"
    fi
    export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
fi

if [ -n "$FORCE_DB_FILE" ]; then
    if [ ! -f "$FORCE_DB_FILE" ]; then
        echo ">>> Ошибка: FORCE_DB_FILE не существует: $FORCE_DB_FILE"
        exit 1
    fi
    export DATABASE_URL="file:$FORCE_DB_FILE"
    echo ">>> Принудительно выбрана SQLite база: $FORCE_DB_FILE"
elif [ -n "$FORCE_DATABASE_URL" ]; then
    export DATABASE_URL="$FORCE_DATABASE_URL"
    echo ">>> Принудительно выбрана DATABASE_URL из FORCE_DATABASE_URL"
elif [ -f "$ROOT_DB" ] || [ -f "$PRISMA_DB" ]; then
    if [ -f "$ROOT_DB" ] && [ -f "$PRISMA_DB" ]; then
        ROOT_SIZE=$(wc -c < "$ROOT_DB")
        PRISMA_SIZE=$(wc -c < "$PRISMA_DB")
        if [ "$PRISMA_SIZE" -ge "$ROOT_SIZE" ]; then
            DB_FILE="$PRISMA_DB"
        else
            DB_FILE="$ROOT_DB"
        fi
    elif [ -f "$PRISMA_DB" ]; then
        DB_FILE="$PRISMA_DB"
    else
        DB_FILE="$ROOT_DB"
    fi

    export DATABASE_URL="file:$DB_FILE"
    echo ">>> Используется SQLite база: $DB_FILE"
else
    echo ">>> Файлы .dev.db не найдены, использую DATABASE_URL из .env"
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
