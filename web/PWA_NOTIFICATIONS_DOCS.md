# Настройка PWA и Push-уведомлений

Система Golden Russia теперь поддерживает PWA (Progressive Web App) и мгновенные Push-уведомления.

## 1. PWA
Приложение можно установить на рабочий стол (Windows/macOS) или на главный экран телефона (iOS/Android).
- **Manifest:** [manifest.json](file:///c:/Users/ethan/Desktop/project/Golden%20Russia/web/public/manifest.json)
- **Service Worker:** [sw.js](file:///c:/Users/ethan/Desktop/project/Golden%20Russia/web/public/sw.js)

## 2. Push-уведомления (Web Push)
Для работы уведомлений необходимо сгенерировать VAPID ключи.

### Генерация ключей
Выполните команду в папке `web`:
```bash
npx web-push generate-vapid-keys
```

### Настройка .env
Добавьте полученные ключи в файл `web/.env`:
```env
VAPID_PUBLIC_KEY=ваш_публичный_ключ
VAPID_PRIVATE_KEY=ваш_приватный_ключ
NEXT_PUBLIC_VAPID_PUBLIC_KEY=ваш_публичный_ключ
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Архитектура
- **Клиент:** [pwa-service.tsx](file:///c:/Users/ethan/Desktop/project/Golden%20Russia/web/src/components/pwa-service.tsx) запрашивает разрешение и регистрирует подписку.
- **Сервер:** [push-notifications.ts](file:///c:/Users/ethan/Desktop/project/Golden%20Russia/web/src/lib/push-notifications.ts) сохраняет подписки и отправляет уведомления через `web-push`.
- **Триггер:** Уведомления отправляются автоматически при создании нового сообщения в [chat.ts](file:///c:/Users/ethan/Desktop/project/Golden%20Russia/web/src/app/actions/chat.ts).

## 4. База данных
Добавлены новые поля в модель `User` и таблица `PushSubscription`. Не забудьте выполнить миграцию:
```bash
npx prisma db push
```
