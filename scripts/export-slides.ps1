param(
    [string]$PptxPath = "C:\Users\mahak\OneDrive\Desktop\MEGA_GAME\Collab\JOB-KART\JOB-KART-Presentation.pptx"
)
$ErrorActionPreference = "Stop"
try {
    $app = [Runtime.InteropServices.Marshal]::GetActiveObject('PowerPoint.Application')
    Write-Output "ATTACHED to running PowerPoint"
} catch {
    $app = New-Object -ComObject PowerPoint.Application
    Write-Output "STARTED new PowerPoint"
}
$pres = $app.Presentations.Open($PptxPath, $true, $false, $true)
$outDir = "C:\Users\mahak\OneDrive\Desktop\MEGA_GAME\Collab\JOB-KART\ppt-assets\render"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$i = 1
foreach ($slide in $pres.Slides) {
    $slide.Export("$outDir\slide$i.png", "PNG", 1600, 900)
    $i++
}
$pres.Close()
Write-Output "EXPORTED $($i - 1) slides"
