$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
  Write-Host "GitHub CLI not found. Install with: winget install GitHub.cli"
  exit 1
}

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged into GitHub. Run: gh auth login"
  exit 1
}

if (Test-Path "$Root\scripts\update.ps1") {
  & powershell -ExecutionPolicy Bypass -File "$Root\scripts\update.ps1"
}

git add -A
$status = git status --porcelain
if ($status) {
  git -c user.name="jinsu" -c user.email="jinsu@users.noreply.github.com" commit -m "Update portfolio content"
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  $owner = gh api user -q .login
  gh repo create portfolio --public --source=. --remote=origin --push
  gh api -X PUT "/repos/$owner/portfolio/pages" -f build_type=workflow 2>$null
  Write-Host ""
  Write-Host "Site will be live in ~1 minute at:"
  Write-Host "https://$owner.github.io/portfolio/"
} else {
  git push origin HEAD
  $owner = gh api user -q .login
  Write-Host ""
  Write-Host "Pushed. Site: https://$owner.github.io/portfolio/"
}
