<#
  Ceramica Puerto Rico - publicacion del sitio en el hosting por FTPS.

  Que hace:
    1. Compila el sitio
    2. Respalda el .htaccess actual en /revision-<sello>/
    3. Sube el sitio (dist) y vendor/ (PHPMailer) archivo por archivo
    4. VERIFICA que cada archivo remoto tenga el tamano del local y
       resubrive los que quedaron truncados
    5. Sube el .htaccess AL FINAL
    6. Comprueba que el sitio responda

  Por que archivo por archivo y no de a lotes: subiendo varios archivos en
  una sola conexion de curl, el servidor dejo algunos con 0 bytes y eso
  no se ve en el codigo HTTP (un archivo vacio responde 200 igual). Por eso
  el paso 4 verifica los tamanos.

  Credenciales: se leen de variables de entorno o de .ferozo-credentials
  (que esta en .gitignore). Nunca se guardan en el repo.

    set FTP_HOST=a1000380.ferozo.com
    set FTP_USER=codex@ceramicaptorico.com.ar
    set FTP_PASS=...
    set FTP_DIR=/
#>
param([switch]$DryRun)

$ErrorActionPreference = 'Stop'
$repo   = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist   = Join-Path $repo 'dist'
$vendor = Join-Path $repo 'vendor'
$curl   = "$env:SystemRoot\System32\curl.exe"

# --- credenciales ---
$credFile = Join-Path $repo '.ferozo-credentials'
if ($credFile -and (Test-Path -LiteralPath $credFile)) {
  $ftp = @{}; $sec = ''
  foreach ($l in (Get-Content -LiteralPath $credFile)) {
    $x = $l.Trim()
    if ($x -match '^\[(.+)\]$') { $sec = $Matches[1]; continue }
    if ($x -match '^#' -or $x -eq '') { continue }
    if ($x -match '^([^=]+?)\s*=\s*(.*)$') { $ftp["$sec.$($Matches[1].Trim())"] = $Matches[2].Trim() }
  }
  if (-not $env:FTP_HOST -and $ftp['ftp.host'])     { $env:FTP_HOST = $ftp['ftp.host'] }
  if (-not $env:FTP_USER -and $ftp['ftp.user'])     { $env:FTP_USER = $ftp['ftp.user'] }
  if (-not $env:FTP_PASS -and $ftp['ftp.password']) { $env:FTP_PASS = $ftp['ftp.password'] }
}
if (-not $env:FTP_HOST) { throw 'Falta FTP_HOST (o .ferozo-credentials en la raiz del repo).' }
if (-not $env:FTP_USER) { throw 'Falta FTP_USER.' }
if (-not $env:FTP_PASS) { throw 'Falta FTP_PASS.' }
if (-not $env:FTP_DIR)  { $env:FTP_DIR = '/' }
$base = "ftp://$($env:FTP_HOST)$($env:FTP_DIR)"

function Invoke-Ftp {
  param([string[]]$CurlArgs)
  & $curl @CurlArgs
}

function Get-RemoteSizes {
  param([string]$RemoteRoot, [string[]]$OnlyDirs = @())
  $map = @{}
  $queue = New-Object System.Collections.Queue
  $queue.Enqueue($RemoteRoot)
  while ($queue.Count -gt 0) {
    $d = $queue.Dequeue()
    # Si se passa la lista de carpetas que se subieron, no se recorren las
    # demas: el docroot tiene el WordPress viejo (miles de carpetas) y listarlo
    # entero por FTP tarda media hora y carga el servidor al limite.
    if ($OnlyDirs.Count -gt 0 -and $OnlyDirs -notcontains $d) { continue }
    $listing = Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','120','-s',"$base$d")
    if (-not $listing) { continue }
    foreach ($line in $listing) {
      $t = "$line".TrimEnd()
      if ($t -eq '' -or $t -match '^\s*$') { continue }
      if ($t -notmatch '^(?<tipo>[-d])(?<perm>\S{9})\s+\d+\s+\S+\s+\S+\s+(?<tam>\d+)\s+\S+\s+\S+\s+\S+\s+(?<nombre>.+)$') { continue }
      $nombre = $Matches['nombre'].Trim()
      if ($nombre -eq '.' -or $nombre -eq '..') { continue }
      if ($nombre -match '^->') { $nombre = ($nombre -split '\s+')[-1] }
      if ($Matches['tipo'] -eq 'd') { $queue.Enqueue("$d$nombre/") }
      else { $map["$d$nombre"] = [int64]$Matches['tam'] }
    }
  }
  return $map
}

function Send-Tree {
  param([string]$LocalRoot, [string]$RemoteRoot, [string]$Label, [string]$Skip = '')
  $files = @(Get-ChildItem -LiteralPath $LocalRoot -Recurse -File | Where-Object { $_.Name -ne $Skip })
  Write-Host "  $Label : $($files.Count) archivos"
  if ($DryRun) { return 0 }
  $fallos = @(); $i = 0
  foreach ($f in $files) {
    $i++
    $rel = $f.FullName.Substring($LocalRoot.Length + 1) -replace '\\','/'
    Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','180','-s','--ftp-create-dirs','-T',$f.FullName,"$base$RemoteRoot$rel") | Out-Null
    if ($LASTEXITCODE -ne 0) { $fallos += $rel }
    if ($i % 25 -eq 0) { Write-Host "    $i/$($files.Count)" }
  }
  if ($fallos.Count -gt 0) {
    Write-Host "    ERROR: $($fallos.Count) archivos no se pudieron subir:"
    $fallos | Select-Object -First 10 | ForEach-Object { Write-Host "      $_" }
  }
  return $fallos.Count
}

function Test-Tree {
  param([string]$LocalRoot, [string]$RemoteRoot, [string]$Label, [string]$Skip = '')
  $local = @(Get-ChildItem -LiteralPath $LocalRoot -Recurse -File | Where-Object { $_.Name -ne $Skip })
  # Sólo se listan por FTP las carpetas donde hay archivos de este deploy:
  # listar el docroot entero (con el WordPress viejo) tarda media hora y fue
  # lo que dejó el hosting sin responder el 23/10/2026.
  $dirs = @($RemoteRoot)
  foreach ($f in $local) {
    $rel = $f.FullName.Substring($LocalRoot.Length + 1) -replace '\\','/'
    $parts = $rel -split '/'
    for ($i = 1; $i -lt $parts.Count; $i++) {
      $d = $RemoteRoot + (($parts[0..($i-1)]) -join '/') + '/'
      if ($dirs -notcontains $d) { $dirs += $d }
    }
  }
  $remote = Get-RemoteSizes $RemoteRoot $dirs
  $malos = @()
  foreach ($f in $local) {
    $rel = $f.FullName.Substring($LocalRoot.Length + 1) -replace '\\','/'
    $r = "$RemoteRoot$rel"
    if (-not $remote.ContainsKey($r)) { $malos += $rel }
    elseif ([int64]$remote[$r] -ne $f.Length) { $malos += $rel }
  }
  Write-Host "  $Label : verificados $($local.Count) | con tamano distinto o faltantes: $($malos.Count)"
  if ($malos.Count -gt 0 -and -not $DryRun) {
    Write-Host '    resubiviendo...'
    foreach ($rel in $malos) {
      $path = Join-Path $LocalRoot ($rel -replace '/','\')
      Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','180','-s','--ftp-create-dirs','-T',$path,"$base$RemoteRoot$rel") | Out-Null
    }
    Write-Host "    resubividos: $($malos.Count)"
  }
  return $malos.Count
}

function Get-FtpTree {
  param([string]$RemoteRoot, [string]$LocalRoot)
  $queue = New-Object System.Collections.Queue
  $queue.Enqueue($RemoteRoot)
  while ($queue.Count -gt 0) {
    $d = $queue.Dequeue()
    $listing = Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','120','-s',"$base$d")
    if (-not $listing) { continue }
    foreach ($line in $listing) {
      $t = "$line".TrimEnd()
      if ($t -eq '' -or $t -match '^\s*$') { continue }
      if ($t -notmatch '^(?<tipo>[-d])(?<perm>\S{9})\s+\d+\s+\S+\s+\S+\s+\d+\s+\S+\s+\S+\s+\S+\s+(?<nombre>.+)$') { continue }
      $nombre = $Matches['nombre'].Trim()
      if ($nombre -eq '.' -or $nombre -eq '..') { continue }
      if ($nombre -match '^->') { $nombre = ($nombre -split '\s+')[-1] }
      if ($Matches['tipo'] -eq 'd') {
        $child = Join-Path $LocalRoot $nombre
        if (-not (Test-Path -LiteralPath $child)) { New-Item -ItemType Directory -Path $child -Force | Out-Null }
        $queue.Enqueue("$d$nombre/")
      } else {
        $path = Join-Path $LocalRoot $nombre
        $parent = Split-Path -Parent $path
        if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','120','-s','-o',$path,"$base$d$nombre") | Out-Null
      }
    }
  }
}

Write-Host ''
Write-Host '1/6  Compilando...'
Push-Location $repo
& npm run build
$buildOk = ($LASTEXITCODE -eq 0)
Pop-Location
if (-not $buildOk) { throw 'Fallo el build: se aborta sin tocar el servidor.' }

Write-Host ''
Write-Host '2/6  Respaldando el .htaccess actual...'
$sello  = (Get-Date).ToString('yyyyMMdd-HHmm')
$backup = "revision-$sello"
$tmpHt  = Join-Path $env:TEMP "htaccess-$sello"
Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','120','-s','-o',$tmpHt,"$base/.htaccess") | Out-Null
if (Test-Path -LiteralPath $tmpHt) {
  Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','120','-s','--ftp-create-dirs','-T',$tmpHt,"$base/$backup/.htaccess") | Out-Null
  Write-Host "  respaldo en /$backup/.htaccess"
}

Write-Host ''
Write-Host '3/6  Subiendo el sitio...'
Send-Tree $dist '/' 'sitio' '.htaccess' | Out-Null

Write-Host ''
Write-Host '4/6  Verificando los tamanos del sitio...'
$malosSitio = Test-Tree $dist '/' 'sitio' '.htaccess'

Write-Host ''
Write-Host '5/6  Subiendo vendor/ (PHPMailer)...'
$vendorLocal = $vendor
if (-not (Test-Path -LiteralPath $vendorLocal)) {
  # PHPMailer no esta en el repo (no hay composer.json). La copia que ya
  # esta en el hosting se puede bajar y volver a subir. Sin esto el
  # formulario responde ok pero solo escribe a un log: no manda mail.
  Write-Host '  no hay vendor/ en el repo: se baja la copia del hosting...'
  $vendorLocal = Join-Path $env:TEMP "ceramica-vendor-$sello"
  if (Test-Path -LiteralPath $vendorLocal) { Remove-Item -LiteralPath $vendorLocal -Recurse -Force }
  New-Item -ItemType Directory -Path $vendorLocal -Force | Out-Null
  Get-FtpTree '/nueva_web/vendor/' $vendorLocal
  $n = @(Get-ChildItem -LiteralPath $vendorLocal -Recurse -File).Count
  Write-Host "  bajados $n archivos"
  if ($n -eq 0) { throw 'No se pudo bajar vendor/ del hosting.' }
}
Send-Tree $vendorLocal '/vendor/' 'vendor' | Out-Null
$malosVendor = Test-Tree $vendorLocal '/vendor/' 'vendor'

Write-Host ''
Write-Host '6/6  Subiendo el .htaccess (al final)...'
if (-not $DryRun) {
  Invoke-Ftp @('--ssl-reqd','--user',"$($env:FTP_USER):$($env:FTP_PASS)",'--max-time','180','-s','--ftp-create-dirs','-T',(Join-Path $dist '.htaccess'),"$base/.htaccess") | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Fallo la subida del .htaccess.' }
}

Write-Host ''
Write-Host 'Comprobando el sitio...'
foreach ($u in @('/','/productos/12x18x24-liviano','/historia-y-proceso','/contacto')) {
  $code = & $curl -s -o NUL -w '%{http_code}' --max-time 30 "https://ceramicaptorico.com.ar$u"
  Write-Host ("  {0}  {1}" -f $code, $u)
}
Write-Host ''
Write-Host "Pendientes de corregir: sitio=$malosSitio vendor=$malosVendor"
Write-Host "Respaldo del .htaccess anterior: /$backup/.htaccess"
