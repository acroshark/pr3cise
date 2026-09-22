# Reinstala (o actualiza) las habilidades de marketing y SEO en este proyecto.
#
# La copia maestra vive en M:\OneDrive\agentes-equipomarketing (ver su LEEME.md).
# Aquí solo se copia lo que se usa a .claude\skills y .claude\agents, que van
# fuera de git: así el repo no se llena de ficheros de terceros.
#
#   powershell -ExecutionPolicy Bypass -File scripts\instalar-agentes-marketing.ps1

$ErrorActionPreference = 'Stop'

$origen   = 'M:\OneDrive\agentes-equipomarketing'
$proyecto = Split-Path -Parent $PSScriptRoot
$skills   = Join-Path $proyecto '.claude\skills'
$agentes  = Join-Path $proyecto '.claude\agents'

# Las de marketing que usamos; las de SEO (seo*) se copian todas
$deMarketing = @(
  'ai-seo', 'programmatic-seo', 'content-strategy', 'copywriting', 'aso',
  'social', 'community-marketing', 'marketing-plan', 'competitor-profiling',
  'cro', 'referrals', 'directory-submissions', 'product-marketing'
)

if (-not (Test-Path $origen)) { throw "No encuentro $origen" }
New-Item -ItemType Directory -Force -Path $skills, $agentes | Out-Null

foreach ($repo in @('claude-seo', 'marketingskills')) {
  $ruta = Join-Path $origen $repo
  if (Test-Path (Join-Path $ruta '.git')) {
    Write-Host "Actualizando $repo..."
    git -C $ruta pull --ff-only 2>&1 | Out-Null
  }
}

Write-Host 'Copiando habilidades de SEO...'
Copy-Item -Recurse -Force (Join-Path $origen 'claude-seo\skills\*') $skills
Copy-Item -Force (Join-Path $origen 'claude-seo\agents\*.md') $agentes

Write-Host 'Copiando habilidades de marketing...'
foreach ($s in $deMarketing) {
  $ruta = Join-Path $origen "marketingskills\skills\$s"
  if (Test-Path $ruta) { Copy-Item -Recurse -Force $ruta $skills }
  else { Write-Warning "no está: $s" }
}

# Los scripts de Python viven en la copia maestra, no dentro del proyecto
Write-Host 'Arreglando rutas...'
$destino = ($origen -replace '\\', '/') + '/claude-seo'
Get-ChildItem -Path $skills, $agentes -Recurse -Include *.md, *.txt | ForEach-Object {
  $texto = Get-Content -Raw -LiteralPath $_.FullName
  if ($texto -like '*${CLAUDE_PLUGIN_ROOT}*') {
    ($texto -replace '\$\{CLAUDE_PLUGIN_ROOT\}', $destino) |
      Set-Content -NoNewline -Encoding utf8 -LiteralPath $_.FullName
  }
}

$nSkills = (Get-ChildItem $skills -Directory).Count
$nAgentes = (Get-ChildItem $agentes -File).Count
Write-Host "Listo: $nSkills habilidades y $nAgentes agentes en .claude"
Write-Host 'El contexto del producto está en .claude\product-marketing.md'
