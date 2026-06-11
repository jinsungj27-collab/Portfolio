$Root = $PSScriptRoot
Set-Location $Root

Write-Host "Portfolio running at http://localhost:8080"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

& python -m http.server 8080 --bind 127.0.0.1
