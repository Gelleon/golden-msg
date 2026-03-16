# ==============================================================================
# Универсальный скрипт: GitHub Push -> SSH Deploy (Исправленный порядок)
# ==============================================================================

$SERVER_IP = "217.26.27.86"
$SERVER_USER = "root"
$COMMIT_MSG = "deploy-$(Get-Date -Format 'yyyy-MM-dd-HH-mm')"

try {
    Write-Host "`n>>> ШАГ 1: Сохранение и синхронизация с GitHub..." -ForegroundColor Cyan
    
    # 1. Сначала добавляем и фиксируем локальные изменения
    Write-Host "Добавляю изменения и создаю локальный коммит..." -ForegroundColor Gray
    git add .
    # Проверяем, есть ли что коммитить
    $status = git status --porcelain
    if ($status) {
        git commit -m "$COMMIT_MSG"
        Write-Host "Коммит создан: $COMMIT_MSG" -ForegroundColor Green
    } else {
        Write-Host "Нет изменений для коммита." -ForegroundColor Yellow
    }

    # 2. Теперь забираем изменения из GitHub
    Write-Host "Выполняю git pull --rebase..." -ForegroundColor Gray
    git pull origin main --rebase
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка при получении изменений (git pull). Возможно, есть конфликты, которые нужно решить вручную."
    }

    # 3. Пушим в GitHub
    Write-Host "Отправляю всё в GitHub (git push)..." -ForegroundColor Gray
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка при отправке в GitHub (git push)."
    }

    Write-Host "`n>>> ШАГ 2: Деплой на сервер..." -ForegroundColor Cyan
    
    # 4. Копируем скрипт деплоя на сервер
    Write-Host "Копирую deploy.sh на сервер (потребуется пароль)..." -ForegroundColor Gray
    scp deploy.sh "${SERVER_USER}@${SERVER_IP}:/tmp/deploy.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка при копировании файла через scp."
    }

    # 5. Запускаем скрипт на сервере
    Write-Host "Запускаю обновление на сервере по SSH (потребуется пароль)..." -ForegroundColor Gray
    ssh "${SERVER_USER}@${SERVER_IP}" "bash /tmp/deploy.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "Ошибка при выполнении команд на сервере по SSH."
    }

    Write-Host "`n✅ ВСЕ ГОТОВО! Проект обновлен в GitHub и на сервере." -ForegroundColor Green

} catch {
    Write-Host "`n❌ ОШИБКА: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Write-Host "`nНажмите любую клавишу, чтобы закрыть окно..." -ForegroundColor Gray
    $null = [System.Console]::ReadKey($true)
}