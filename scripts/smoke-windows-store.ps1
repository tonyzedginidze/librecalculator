$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$exe = (Resolve-Path "store-output/package/libre-calculator-desktop.exe").Path
$process = Start-Process $exe -PassThru
try {
    $deadline = (Get-Date).AddSeconds(45)
    do {
        Start-Sleep -Milliseconds 500
        $process.Refresh()
        if ($process.HasExited) { throw "Desktop app exited before showing a window." }
    } while ($process.MainWindowHandle -eq 0 -and (Get-Date) -lt $deadline)
    if ($process.MainWindowHandle -eq 0) { throw "Desktop app did not show a window." }
    Start-Sleep -Seconds 5
    $window = [System.Windows.Automation.AutomationElement]::FromHandle($process.MainWindowHandle)
    $elements = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)
    $names = @($elements | ForEach-Object { $_.Current.Name } | Where-Object { $_ })
    $names | Set-Content store-output/smoke-accessibility.txt
    if (-not ($names -match 'Percentage|All calculators|Search calculators')) { throw "The calculator UI did not load." }
    $rect = $window.Current.BoundingRectangle
    $bitmap = [System.Drawing.Bitmap]::new([int]$rect.Width, [int]$rect.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.CopyFromScreen([int]$rect.X, [int]$rect.Y, 0, 0, $bitmap.Size)
        $bitmap.Save("$PWD/store-output/smoke-windows.png", [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
    "Windows executable launched successfully and rendered calculator UI." | Set-Content store-output/smoke-result.txt
} finally {
    if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force }
}
