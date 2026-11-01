$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$exe = (Resolve-Path "store-output/package/libre-calculator-desktop.exe").Path
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = "--force-renderer-accessibility"
$process = Start-Process $exe -PassThru
try {
    $deadline = (Get-Date).AddSeconds(45)
    do {
        Start-Sleep -Milliseconds 500
        $process.Refresh()
        if ($process.HasExited) { throw "Desktop app exited before showing a window." }
    } while ($process.MainWindowHandle -eq 0 -and (Get-Date) -lt $deadline)
    if ($process.MainWindowHandle -eq 0) { throw "Desktop app did not show a window." }
    $deadline = (Get-Date).AddSeconds(45)
    do {
        Start-Sleep -Seconds 1
        $window = [System.Windows.Automation.AutomationElement]::FromHandle($process.MainWindowHandle)
        $elements = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)
        $names = @($elements | ForEach-Object { $_.Current.Name } | Where-Object { $_ })
    } while (-not ($names -match 'Percentage|All calculators|Search calculators') -and (Get-Date) -lt $deadline)
    $names | Set-Content store-output/smoke-accessibility.txt
    $rect = $window.Current.BoundingRectangle
    $bitmap = [System.Drawing.Bitmap]::new([int]$rect.Width, [int]$rect.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.CopyFromScreen([int]$rect.X, [int]$rect.Y, 0, 0, $bitmap.Size)
        $bitmap.Save("$PWD/store-output/smoke-windows.png", [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
    if (-not ($names -match 'Percentage|All calculators|Search calculators')) { throw "The calculator UI did not load. See smoke screenshot and accessibility diagnostics." }
    "Windows executable launched successfully and rendered calculator UI." | Set-Content store-output/smoke-result.txt
} finally {
    if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force }
}

# Test an independently signed copy. The upload artifact remains unsigned so
# the Store can sign it; no development certificate ships with that artifact.
[xml]$manifest = Get-Content store-output/package/AppxManifest.xml
$identity = [string]$manifest.Package.Identity.Name
$certificate = New-SelfSignedCertificate -Type CodeSigningCert -Subject $manifest.Package.Identity.Publisher -CertStoreLocation Cert:\CurrentUser\My
$certificateFile = Join-Path $env:RUNNER_TEMP "librecalculator-smoke.cer"
$testPackage = Join-Path $env:RUNNER_TEMP "librecalculator-smoke.msix"
$installed = $false
try {
    Export-Certificate -Cert $certificate -FilePath $certificateFile | Out-Null
    Import-Certificate -FilePath $certificateFile -CertStoreLocation Cert:\LocalMachine\TrustedPeople | Out-Null
    Copy-Item (Get-ChildItem store-output/*.msix | Select-Object -First 1).FullName $testPackage
    $signTool = Get-ChildItem "${env:ProgramFiles(x86)}/Windows Kits/10/bin/*/x64/signtool.exe" |
        Sort-Object { [version]$_.Directory.Parent.Name } -Descending | Select-Object -First 1
    & $signTool.FullName sign /fd SHA256 /sha1 $certificate.Thumbprint $testPackage
    if ($LASTEXITCODE -ne 0) { throw "Could not sign the temporary installation test package." }
    Add-AppxPackage -Path $testPackage
    $installed = $true
    $package = Get-AppxPackage -Name $identity
    if (-not $package) { throw "Installed Store package was not found." }
    Start-Process explorer.exe -ArgumentList "shell:AppsFolder\$($package.PackageFamilyName)!LibreCalculator"
    $deadline = (Get-Date).AddSeconds(45)
    do {
        Start-Sleep -Seconds 1
        $packagedProcess = Get-Process -Name libre-calculator-desktop -ErrorAction SilentlyContinue |
            Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
    } while (-not $packagedProcess -and (Get-Date) -lt $deadline)
    if (-not $packagedProcess) { throw "Installed package did not open a window." }
    Start-Sleep -Seconds 5
    if ($packagedProcess.HasExited) { throw "Installed package exited unexpectedly." }
    "Installed and launched $($package.PackageFullName) through its AppsFolder identity." | Set-Content store-output/smoke-install.txt
    Stop-Process -Id $packagedProcess.Id -Force
} finally {
    if ($installed) { Get-AppxPackage -Name $identity | Remove-AppxPackage }
    Remove-Item "Cert:\CurrentUser\My\$($certificate.Thumbprint)" -ErrorAction SilentlyContinue
    Remove-Item "Cert:\LocalMachine\TrustedPeople\$($certificate.Thumbprint)" -ErrorAction SilentlyContinue
    Remove-Item $certificateFile, $testPackage -ErrorAction SilentlyContinue
}
