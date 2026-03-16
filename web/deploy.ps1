# ==============================================================================
# PowerShell скрипт локального пуша и деплоя на сервер
# ==============================================================================

$SERVER_IP = "217.26.27.86"
$SERVER_USER = "root"
$COMMIT_MSG = "fix-invite-urls-at-2026-03-16-15-17"

try {
    Write-Host "--- 1. Сохранение изменений в GitHub ---" -ForegroundColor Cyan
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main

    if ($LASTEXITCODE -ne 0) {
        throw "[ERROR] Ошибка при пуше в GitHub. Деплой остановлен."
    }

    Write-Host "
--- 2. Копирование скрипта деплоя на сервер ---" -ForegroundColor Cyan
    scp deploy.sh "$()@$():/tmp/deploy.sh"

    if ($LASTEXITCODE -ne 0) {
        throw "[ERROR] Ошибка при копировании файла через scp."
    }

    Write-Host "
--- 3. Запуск деплоя на сервере по SSH ---" -ForegroundColor Cyan
    ssh "$()@$()" "bash /tmp/deploy.sh"

    if ($LASTEXITCODE -ne 0) {
        throw "[ERROR] Ошибка при выполнении деплоя на сервере."
    }

    Write-Host "
--- ВСЕ ГОТОВО! Проект обновлен на сервере. ---" -ForegroundColor Green
} catch {
    Write-Host "
$($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Пожалуйста, проверьте ошибки выше." -ForegroundColor Yellow
} finally {
    Write-Host "
Нажмите любую клавишу, чтобы закрыть это окно..." -ForegroundColor Gray
    $null = [System.Console]::ReadKey($true)
}