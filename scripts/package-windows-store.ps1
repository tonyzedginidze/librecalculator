param(
    [Parameter(Mandatory = $true)][string]$Executable,
    [string]$Output = "store-output"
)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$repo = Split-Path $PSScriptRoot -Parent
$Executable = (Resolve-Path $Executable).Path
$Output = [System.IO.Path]::GetFullPath($Output)
$stage = Join-Path $Output "package"
if (Test-Path $stage) { throw "Use an empty output directory: $stage already exists." }
New-Item -ItemType Directory -Path "$stage/Assets" -Force | Out-Null
Copy-Item $Executable "$stage/libre-calculator-desktop.exe"
[xml]$manifest = Get-Content "$repo/apps/desktop/store/AppxManifest.xml"
$version = (Get-Content "$repo/apps/desktop/package.json" | ConvertFrom-Json).version
if ($version -notmatch '^\d+\.\d+\.\d+$') { throw "Store packaging requires a stable three-part version." }
$manifest.Package.Identity.Version = "$version.0"
$manifest.Save("$stage/AppxManifest.xml")

# Generate actual Store tiles from the application's existing branded icon.
Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile("$repo/apps/desktop/src-tauri/icons-src/app.png")
try {
    foreach ($tile in @(
        @{ Name = "StoreLogo"; Width = 50; Height = 50 },
        @{ Name = "Square44x44Logo"; Width = 44; Height = 44 },
        @{ Name = "Square150x150Logo"; Width = 150; Height = 150 },
        @{ Name = "Wide310x150Logo"; Width = 310; Height = 150 }
    )) {
        $bitmap = [System.Drawing.Bitmap]::new($tile.Width, $tile.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.Color]::Transparent)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $size = [Math]::Min($tile.Width, $tile.Height)
            $graphics.DrawImage($source, [int](($tile.Width - $size) / 2), 0, $size, $size)
            $bitmap.Save("$stage/Assets/$($tile.Name).png", [System.Drawing.Imaging.ImageFormat]::Png)
        } finally { $graphics.Dispose(); $bitmap.Dispose() }
    }
} finally { $source.Dispose() }

$sdk = Get-ChildItem "${env:ProgramFiles(x86)}/Windows Kits/10/bin/*/x64/makeappx.exe" |
    Sort-Object { [version]$_.Directory.Parent.Name } -Descending | Select-Object -First 1
if (-not $sdk) { throw "Windows SDK makeappx.exe was not found." }
$package = Join-Path $Output "LibreCalculator_$version`_x64.msix"
& $sdk.FullName pack /d $stage /p $package /o
if ($LASTEXITCODE -ne 0) { throw "MakeAppx failed: $LASTEXITCODE" }
$hash = (Get-FileHash $package -Algorithm SHA256).Hash.ToLowerInvariant()
"$hash  $([System.IO.Path]::GetFileName($package))" | Set-Content "$Output/SHA256SUMS.txt"
Write-Host "Store package: $package"
