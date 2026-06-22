# Debug Session: mobile-room-back

Status: FIXED

## Problem
- В мобильной версии кнопка выхода из комнаты в список всех комнат срабатывала не при каждом нажатии.

## Root Cause (confirmed)
- **H1 + H4 (CONFIRMED):** Кнопка «назад» находилась внутри общего flex-контейнера с `overflow-hidden` вместе с аватаром и заголовком комнаты. На узких экранах соседние элементы перекрывали интерактивную область — `elementFromPoint` попадал не в кнопку.
- **H4 (CONFIRMED):** Touch target был меньше рекомендованных 44×44 px (`p-2` + иконка 20px ≈ 36px), из-за чего часть тапов промахивалась.
- **H3 (PARTIAL):** `Link` без защиты от повторных нажатий мог вызывать гонки при быстрых тапах во время `PageTransition`.

## Fix
- Новый клиентский компонент `MobileRoomBackButton`:
  - `min-h-[44px] min-w-[44px]`, `z-30`, `shrink-0`, `touch-manipulation`
  - `onPointerUp` вместо задержанного click-цикла
  - защита от двойных нажатий (800ms guard)
  - `router.push("/dashboard")` с `stopPropagation`
- Кнопка вынесена из `overflow-hidden` блока заголовка в отдельную колонку.
- Удалена отладочная инструментация (ломала production build).

## Verification
- `npm test -- --testPathPatterns=mobile-room-back-button` — 2/2 passed
- `npm run build` — success
- Playwright e2e: требуется `npx playwright install` (браузеры не были установлены в среде)
- Ручное тестирование на физических устройствах — выполнить локально после деплоя
