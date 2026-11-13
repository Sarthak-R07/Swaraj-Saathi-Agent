$wsh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop "Swaraj Saathi Agent Dashboard.lnk"
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "D:\Swaraj Scheme Portal\Launch_Agent_Dashboard.bat"
$shortcut.WorkingDirectory = "D:\Swaraj Scheme Portal"
$shortcut.Description = "Launch Swaraj Saathi Kendra Agent Dashboard"
$shortcut.WindowStyle = 1
$shortcut.Save()

# Also write to local Desktop if redirected
$localDesktop = "C:\Users\lenovo\Desktop"
if (Test-Path $localDesktop) {
    Copy-Item -Path $shortcutPath -Destination (Join-Path $localDesktop "Swaraj Saathi Agent Dashboard.lnk") -Force
}
Write-Output "SUCCESS: Shortcut updated at $shortcutPath and $localDesktop"
