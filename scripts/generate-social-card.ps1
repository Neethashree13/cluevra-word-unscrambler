Add-Type -AssemblyName System.Drawing

$bitmap = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::FromArgb(242, 246, 243))

$ink = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(23, 44, 40))
$green = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(22, 78, 69))
$soft = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 235, 229))
$coral = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 223, 210))
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(82, 100, 95))
$rust = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(154, 80, 54))
$tileBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(183, 201, 193), 2)
$panelBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(214, 226, 220), 2)
$fontBrand = [System.Drawing.Font]::new('Arial', 30, [System.Drawing.FontStyle]::Bold)
$fontTitle = [System.Drawing.Font]::new('Arial', 60, [System.Drawing.FontStyle]::Bold)
$fontBody = [System.Drawing.Font]::new('Arial', 22, [System.Drawing.FontStyle]::Regular)
$fontLabel = [System.Drawing.Font]::new('Arial', 18, [System.Drawing.FontStyle]::Bold)
$fontWord = [System.Drawing.Font]::new('Arial', 31, [System.Drawing.FontStyle]::Bold)
$fontSmallWord = [System.Drawing.Font]::new('Arial', 19, [System.Drawing.FontStyle]::Bold)
$fontLetter = [System.Drawing.Font]::new('Arial', 28, [System.Drawing.FontStyle]::Bold)

$graphics.FillEllipse($soft, 790, -120, 460, 460)
$graphics.FillEllipse($coral, 990, 430, 410, 410)
$graphics.FillRectangle($green, 80, 75, 54, 54)
$graphics.DrawString('C', $fontBrand, $white, 88, 80)
$graphics.DrawString('Cluevra', $fontBrand, $ink, 154, 80)
$graphics.DrawString('Find words', $fontTitle, $ink, 80, 186)
$graphics.DrawString('from letters', $fontTitle, $ink, 80, 258)
$graphics.DrawString('Unscramble. Filter by length.', $fontBody, $muted, 84, 342)
$graphics.DrawString('Explore anagrams and game words.', $fontBody, $muted, 84, 373)
$graphics.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(201, 217, 210)), 80, 431, 568, 3)
$graphics.DrawString('TRY A RACK', $fontLabel, $muted, 82, 457)

$letters = @('A', 'C', 'E', 'R', 'S', 'T')
for ($index = 0; $index -lt $letters.Count; $index++) {
  $x = 80 + ($index * 50)
  $graphics.FillRectangle($white, $x, 498, 44, 48)
  $graphics.DrawRectangle($tileBorder, $x, 498, 44, 48)
  $graphics.DrawString($letters[$index], $fontLetter, $green, $x + 8, 501)
}

$graphics.FillRectangle($white, 770, 190, 350, 255)
$graphics.DrawRectangle($panelBorder, 770, 190, 350, 255)
$graphics.DrawString('MATCHING WORDS', $fontLabel, $muted, 800, 217)
$graphics.FillRectangle($green, 794, 267, 302, 67)
$graphics.DrawString('CRATES', $fontWord, $white, 811, 278)
$graphics.DrawString('6 letters', $fontLabel, $soft, 1005, 288)
$graphics.FillRectangle($soft, 794, 352, 140, 54)
$graphics.DrawString('CASTER', $fontSmallWord, $green, 810, 367)
$graphics.FillRectangle($coral, 945, 352, 151, 54)
$graphics.DrawString('REACTS', $fontSmallWord, $rust, 960, 367)

$outputPath = Join-Path $PSScriptRoot '..\public\social-card.png'
$bitmap.Save([System.IO.Path]::GetFullPath($outputPath), [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()
$graphics.Dispose()
Write-Output 'Generated public/social-card.png at 1200x630.'