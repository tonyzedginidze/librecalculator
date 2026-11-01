$ErrorActionPreference = 'Stop'

if ((Get-OSArchitectureWidth) -ne 64) {
    throw 'Libre Calculator requires 64-bit Windows.'
}

$packageArgs = @{
    packageName    = $env:ChocolateyPackageName
    fileType       = 'msi'
    url64bit       = 'https://github.com/tonyzedginidze/librecalculator/releases/download/v0.1.0/Libre.Calculator_0.1.0_x64_en-US.msi'
    checksum64     = '11c5fcfc7701ef441fecc5b678de930ef26f3d7e00439fa555fc8ee5a4317248'
    checksumType64 = 'sha256'
    silentArgs     = '/qn /norestart'
    validExitCodes = @(0, 3010, 1641)
    softwareName   = 'Libre Calculator'
}

Install-ChocolateyPackage @packageArgs
