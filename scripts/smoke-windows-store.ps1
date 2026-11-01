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
