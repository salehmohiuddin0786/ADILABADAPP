Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\NEHA ENTERPRISES\.gemini\antigravity\brain\22fb166c-a5a0-47a7-b63f-222f6d2022a0\.user_uploaded\media_1795538849903_7299f499.png"
$resBase = "G:\Usama\Usama\ADILABAD\android\app\src\main\res"

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$srcBitmap = [System.Drawing.Bitmap]::FromFile($sourcePath)

foreach ($folder in $sizes.Keys) {
    $dim = $sizes[$folder]
    $destFolder = Join-Path $resBase $folder
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
    }

    $destBitmap = New-Object System.Drawing.Bitmap $dim, $dim
    $g = [System.Drawing.Graphics]::FromImage($destBitmap)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcBitmap, 0, 0, $dim, $dim)
    $g.Dispose()

    $destFile1 = Join-Path $destFolder "ic_launcher.png"
    $destFile2 = Join-Path $destFolder "ic_launcher_round.png"
    $destFile3 = Join-Path $destFolder "ic_launcher_foreground.png"

    $destBitmap.Save($destFile1, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Save($destFile2, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Save($destFile3, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Dispose()
    Write-Host "Generated $folder icons ($dim x $dim)"
}

$srcBitmap.Dispose()
Write-Host "Android mipmap icons successfully updated!"
