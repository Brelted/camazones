$backendRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$repoRoot = Split-Path -Parent $backendRoot
$two = '2'
$upperMarker = 'H' + $two
$lowerMarker = 'h' + $two
$dot = [regex]::Escape('.')
$patterns = @(
  '\b' + $upperMarker + '\b',
  'jdbc:' + $lowerMarker,
  $lowerMarker + '-console',
  'com' + $dot + $lowerMarker + 'database',
  'spring' + $dot + $lowerMarker,
  'application-' + $lowerMarker
)
$excluded = @('.git', 'node_modules', 'target', 'dist', '.expo', '.gradle', 'build')
$rg = Get-Command rg -ErrorAction SilentlyContinue
if ($rg) {
  $args = @('-n')
  foreach ($dir in $excluded) {
    $args += @('--glob', "!$dir/**")
  }
  foreach ($pattern in $patterns) {
    $args += @('-e', $pattern)
  }
  $args += $repoRoot
  $output = & $rg.Source @args
  if ($LASTEXITCODE -eq 0) {
    $output
    'ForbiddenDbSignatures=True'
    exit 1
  }
  if ($LASTEXITCODE -eq 1) {
    'ForbiddenDbSignatures=False'
    exit 0
  }
  exit $LASTEXITCODE
}
$hits = @()
$files = Get-ChildItem -Path $repoRoot -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
  $relative = $_.FullName.Substring($repoRoot.Length)
  foreach ($dir in $excluded) {
    if ($relative -match "(^|[\\/])$([regex]::Escape($dir))([\\/]|$)") {
      return $false
    }
  }
  return $true
}
foreach ($file in $files) {
  try {
    $matches = Select-String -Path $file.FullName -Pattern $patterns -CaseSensitive -ErrorAction Stop
    if ($matches) {
      $hits += $matches
    }
  } catch {}
}
if ($hits.Count -gt 0) {
  $hits | ForEach-Object { $_.ToString() }
  'ForbiddenDbSignatures=True'
  exit 1
}
'ForbiddenDbSignatures=False'
exit 0
