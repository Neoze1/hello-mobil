$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$packagePath = Join-Path ([IO.Directory]::GetParent($projectRoot).FullName) 'OTOIZ-katalog-guncel.zip'
$report = Get-Content -Raw -Encoding utf8 (Join-Path $projectRoot 'catalogs/entegrasyon-raporu.json') | ConvertFrom-Json
$entries = @{}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $projectRoot 'catalogs') -File) { $entries['catalogs/' + $file.Name] = $file.FullName }
foreach ($model in $report.models) {
  if ($model.image) { $entries['public' + $model.image] = Join-Path $projectRoot ('public' + $model.image) }
}
foreach ($name in @('logo-light.svg', 'logo-dark.svg', 'favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png')) {
  $entries['public/' + $name] = Join-Path $projectRoot ('public/' + $name)
}
$entries['README.md'] = Join-Path $projectRoot 'README.md'
$temporaryPackage = $packagePath + '.tmp'
$stream = [IO.File]::Open($temporaryPackage, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($entry in $entries.GetEnumerator()) {
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $entry.Value, $entry.Key, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $archive.Dispose(); $stream.Dispose() }
Move-Item -LiteralPath $temporaryPackage -Destination $packagePath -Force
Write-Output "Package: $packagePath; $($entries.Count) files; $($report.photosCompleted) approved photos."
