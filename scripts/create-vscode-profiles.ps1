# VS Code Profiles Setup Script (Optimized)
# Creates two focused profiles: Development and Networking (with AI)

$appDataPath = [Environment]::GetFolderPath('ApplicationData')
$vscodeUserPath = "$appDataPath\Code\User"
$profilesPath = "$vscodeUserPath\profiles"

# Ensure profiles directory exists
if (!(Test-Path $profilesPath)) {
    New-Item -ItemType Directory -Path $profilesPath -Force | Out-Null
    Write-Host "Created profiles directory: $profilesPath" -ForegroundColor Green
}

# DEVELOPMENT Profile (10 extensions - lean & focused)
$devExtensions = @(
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    "eamodio.gitlens",
    "ritwickdey.liveserver",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "humao.rest-client"
)

# NETWORKING Profile (10 extensions - API/network focused)
$networkExtensions = @(
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "rangav.vscode-thunder-client",
    "humao.rest-client",
    "ms-vscode-remote.remote-ssh",
    "ms-vscode-remote.remote-ssh-edit",
    "redhat.vscode-yaml",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "eamodio.gitlens"
)

Write-Host "`n=== VS Code Profiles Setup (OPTIMIZED) ===" -ForegroundColor Cyan
Write-Host "Two lean, focused profiles with AI integration`n" -ForegroundColor Yellow

Write-Host "PROFILE 1: Development" -ForegroundColor Green
Write-Host "Extensions: $($devExtensions.Count)"
Write-Host "Purpose: Full-stack web development (WOS Calculator)"
$devExtensions | ForEach-Object { Write-Host "  - $_" }

Write-Host "`nPROFILE 2: Networking" -ForegroundColor Green
Write-Host "Extensions: $($networkExtensions.Count)"
Write-Host "Purpose: API testing, SSH, network automation"
$networkExtensions | ForEach-Object { Write-Host "  - $_" }

Write-Host "`nBoth profiles include GitHub Copilot + Copilot Chat for AI!" -ForegroundColor Magenta

Write-Host "`n" -ForegroundColor Yellow
Write-Host "MANUAL SETUP in VS Code:" -ForegroundColor Cyan
Write-Host "1. Click Profile icon (bottom-left corner)"
Write-Host "2. Select 'Create Profile'"
Write-Host "3. Name: 'Development'"
Write-Host "4. Choose extensions from above to enable"
Write-Host "5. Repeat for 'Networking' profile"
Write-Host "6. Switch profiles anytime using profile icon"

Write-Host "`nAUTO-INSTALL Commands:" -ForegroundColor Yellow
Write-Host "`n--- Development Profile ---"
$devExtensions | ForEach-Object { Write-Host "code --install-extension $_" }

Write-Host "`n--- Networking Profile ---"
$networkExtensions | ForEach-Object { Write-Host "code --install-extension $_" }

Write-Host "`nSetup complete!" -ForegroundColor Green
