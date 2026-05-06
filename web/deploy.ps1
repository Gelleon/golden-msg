# ==============================================================================
# GitHub push -> SSH deploy
# ==============================================================================

$SERVER_IP = "217.26.27.86"
$SERVER_USER = "root"
$COMMIT_MSG = "deploy-$(Get-Date -Format 'yyyy-MM-dd-HH-mm')"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$REPO_ROOT = (git -C $SCRIPT_DIR rev-parse --show-toplevel).Trim()

try {
    Write-Host "`n>>> STEP 1: Sync with GitHub..." -ForegroundColor Cyan
    
    Set-Location $REPO_ROOT

    # 1. Сначала добавляем и фиксируем локальные изменения
    Write-Host "Staging changes and creating a local commit..." -ForegroundColor Gray
    git add -A
    $status = git status --porcelain
    if ($status) {
        git commit -m "$COMMIT_MSG"
        Write-Host "Commit created: $COMMIT_MSG" -ForegroundColor Green
    } else {
        Write-Host "No changes to commit." -ForegroundColor Yellow
    }

    $statusAfterCommit = git status --porcelain
    if ($statusAfterCommit) {
        throw "Working tree is not clean. Please commit/stash/restore these changes first: $statusAfterCommit"
    }

    # 2. Теперь забираем изменения из GitHub
    Write-Host "Running git pull --rebase..." -ForegroundColor Gray
    git pull origin main --rebase
    if ($LASTEXITCODE -ne 0) {
        throw "git pull failed. You may have conflicts to resolve."
    }

    # 3. Пушим в GitHub
    Write-Host "Pushing to GitHub (git push)..." -ForegroundColor Gray
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "git push failed."
    }

    Write-Host "`n>>> STEP 2: Deploy to server..." -ForegroundColor Cyan
    
    # 4. Копируем скрипт деплоя на сервер
    Write-Host "Copying deploy.sh to server (password may be required)..." -ForegroundColor Gray
    scp (Join-Path $SCRIPT_DIR "deploy.sh") "${SERVER_USER}@${SERVER_IP}:/tmp/deploy.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "scp failed."
    }

    # 5. Очищаем скрипт от Windows-переносов строк (на всякий случай) и запускаем
    Write-Host "Running deploy on server via SSH (password may be required)..." -ForegroundColor Gray
    ssh "${SERVER_USER}@${SERVER_IP}" "sed -i 's/\r$//' /tmp/deploy.sh; bash /tmp/deploy.sh"
    if ($LASTEXITCODE -ne 0) {
        throw "Remote deploy failed."
    }

    Write-Host "`nDONE! Project updated on GitHub and server." -ForegroundColor Green

} catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Write-Host "`nPress any key to close..." -ForegroundColor Gray
    $null = [System.Console]::ReadKey($true)
}
