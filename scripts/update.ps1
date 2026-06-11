$Root = Split-Path -Parent $PSScriptRoot
$ProjectsDir = Join-Path $Root "projects"
$FilesDir = Join-Path $Root "files"
$DataDir = Join-Path $Root "data"
$OverridesPath = Join-Path $DataDir "overrides.json"

function Get-Overrides {
  if (-not (Test-Path $OverridesPath)) {
    return @{ projects = @{}; files = @{} }
  }
  $raw = Get-Content $OverridesPath -Raw | ConvertFrom-Json
  return @{
    projects = if ($raw.projects) { $raw.projects } else { @{} }
    files = if ($raw.files) { $raw.files } else { @{} }
  }
}

function Get-ReadmeDescription($dir) {
  $readme = Join-Path $dir "README.md"
  if (-not (Test-Path $readme)) { return "" }
  $line = Get-Content $readme | Where-Object { $_.Trim() } | Select-Object -First 1
  if (-not $line) { return "" }
  return ($line -replace '^\#\s*', '').Trim()
}

function Get-Projects($overrides) {
  if (-not (Test-Path $ProjectsDir)) { return @() }

  $items = Get-ChildItem $ProjectsDir -Directory |
    Where-Object { -not $_.Name.StartsWith('.') } |
    ForEach-Object {
      $name = $_.Name
      $override = $overrides.projects.$name
      if (-not $override) { $override = @{} }

      [PSCustomObject]@{
        name = if ($override.name) { $override.name } else { $name }
        description = if ($override.description) { $override.description } else { Get-ReadmeDescription $_.FullName }
        path = if ($override.path) { $override.path } else { "projects/$name/" }
        external = [bool]$override.external
      }
    }

  return $items | Sort-Object name
}

function Get-Files($dir, $base, $overrides) {
  if (-not (Test-Path $dir)) { return @() }

  $results = @()
  Get-ChildItem $dir -Force | Where-Object { -not $_.Name.StartsWith('.') } | ForEach-Object {
    $rel = "$base/$($_.Name)" -replace '\\', '/'
    if ($_.PSIsContainer) {
      $results += Get-Files $_.FullName $rel $overrides
    } else {
      $key = $rel -replace '^files/', ''
      $override = $overrides.files.$key
      if (-not $override) { $override = $overrides.files.$rel }
      if (-not $override) { $override = @{} }

      $results += [PSCustomObject]@{
        name = if ($override.name) { $override.name } else { $_.Name }
        note = if ($override.note) { $override.note } else { "" }
        path = $rel
      }
    }
  }

  return $results | Sort-Object path
}

$overrides = Get-Overrides
$projects = Get-Projects $overrides
$files = Get-Files $FilesDir "files" $overrides

New-Item -ItemType Directory -Path $DataDir -Force | Out-Null

function Write-JsonArray($path, $items) {
  $arr = @($items)
  if ($arr.Count -eq 0) {
    Set-Content $path "[]" -Encoding utf8
    return
  }
  $json = $arr | ConvertTo-Json -Depth 5
  if ($arr.Count -eq 1 -and -not $json.TrimStart().StartsWith('[')) {
    $json = "[$json]"
  }
  Set-Content $path $json -Encoding utf8
}

Write-JsonArray (Join-Path $DataDir "projects.json") @($projects)
Write-JsonArray (Join-Path $DataDir "files.json") @($files)

$pCount = @($projects).Count
$fCount = @($files).Count
Write-Host "Updated: $pCount project(s), $fCount file(s)."
