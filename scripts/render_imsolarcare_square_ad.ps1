[void][Reflection.Assembly]::LoadWithPartialName("System.Drawing")

$ErrorActionPreference = "Stop"

function New-RoundedRectPath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function Draw-CoverImage {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$ImagePath,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $img = [System.Drawing.Image]::FromFile($ImagePath)
    try {
        $path = New-RoundedRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
        $oldClip = $Graphics.Clip
        $Graphics.SetClip($path)

        $scale = [Math]::Max($Width / $img.Width, $Height / $img.Height)
        $drawWidth = $img.Width * $scale
        $drawHeight = $img.Height * $scale
        $drawX = $X + (($Width - $drawWidth) / 2)
        $drawY = $Y + (($Height - $drawHeight) / 2)
        $Graphics.DrawImage($img, $drawX, $drawY, $drawWidth, $drawHeight)

        $Graphics.SetClip($oldClip, [System.Drawing.Drawing2D.CombineMode]::Replace)
        $path.Dispose()
    }
    finally {
        $img.Dispose()
    }
}

function Draw-Badge {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$TextBrush,
        [System.Drawing.Brush]$BackgroundBrush,
        [float]$X,
        [float]$Y,
        [float]$PaddingX = 18,
        [float]$PaddingY = 10
    )

    $size = $Graphics.MeasureString($Text, $Font)
    $width = $size.Width + ($PaddingX * 2)
    $height = $size.Height + ($PaddingY * 2)
    $path = New-RoundedRectPath -X $X -Y $Y -Width $width -Height $height -Radius 18
    $Graphics.FillPath($BackgroundBrush, $path)
    $Graphics.DrawString($Text, $Font, $TextBrush, $X + $PaddingX, $Y + $PaddingY - 1)
    $path.Dispose()
    return @{ Width = $width; Height = $height }
}

$root = Split-Path -Parent $PSScriptRoot
$beforeImage = "C:\Users\azeem\Downloads\IMG_20260511_185152.jpg.jpeg"
$afterImage = "C:\Users\azeem\Downloads\image-1778506445585.jpg.jpeg"
$outputPath = Join-Path $root "assets\imsolarcare-square-ad-premium.jpg"

$canvas = New-Object System.Drawing.Bitmap 1080, 1080
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgRect = New-Object System.Drawing.Rectangle 0, 0, 1080, 1080
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.ColorTranslator]::FromHtml("#f4fbff"), [System.Drawing.ColorTranslator]::FromHtml("#eaf7ef"), 45)
$graphics.FillRectangle($bgBrush, $bgRect)
$bgBrush.Dispose()

$circleBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 34, 121, 196))
$circleBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 22, 163, 74))
$graphics.FillEllipse($circleBrush1, 760, -30, 320, 320)
$graphics.FillEllipse($circleBrush2, -80, 760, 320, 320)
$circleBrush1.Dispose()
$circleBrush2.Dispose()

$panelPath = New-RoundedRectPath -X 34 -Y 28 -Width 1012 -Height 1020 -Radius 42
$panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 255, 255, 255))
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 18, 45, 71))
$graphics.FillPath($shadowBrush, (New-RoundedRectPath -X 40 -Y 36 -Width 1012 -Height 1020 -Radius 42))
$graphics.FillPath($panelBrush, $panelPath)
$panelBrush.Dispose()
$shadowBrush.Dispose()
$panelPath.Dispose()

$navy = [System.Drawing.ColorTranslator]::FromHtml("#123051")
$green = [System.Drawing.ColorTranslator]::FromHtml("#178a52")
$lightGreen = [System.Drawing.ColorTranslator]::FromHtml("#dcf6e9")
$softBlue = [System.Drawing.ColorTranslator]::FromHtml("#e9f4ff")
$softRed = [System.Drawing.ColorTranslator]::FromHtml("#fff0ed")
$orange = [System.Drawing.ColorTranslator]::FromHtml("#ff8d3a")
$muted = [System.Drawing.ColorTranslator]::FromHtml("#51606f")
$dark = [System.Drawing.ColorTranslator]::FromHtml("#17212c")

$headlineFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$ctaFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
$siteFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$brandFont = New-Object System.Drawing.Font("Segoe UI", 19, [System.Drawing.FontStyle]::Bold)
$starFont = New-Object System.Drawing.Font("Segoe UI Symbol", 18, [System.Drawing.FontStyle]::Regular)

$navyBrush = New-Object System.Drawing.SolidBrush($navy)
$greenBrush = New-Object System.Drawing.SolidBrush($green)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$darkBrush = New-Object System.Drawing.SolidBrush($dark)
$orangeBrush = New-Object System.Drawing.SolidBrush($orange)

[void](Draw-Badge -Graphics $graphics -Text "IM SOLAR CARE" -Font $brandFont -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 64 -Y 54 -PaddingX 18 -PaddingY 8)
[void](Draw-Badge -Graphics $graphics -Text "Professional Solar Panel Cleaning in Lucknow" -Font $smallFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 64 -Y 114 -PaddingX 16 -PaddingY 8)

$headlineRect = New-Object System.Drawing.RectangleF 64, 170, 952, 128
$graphics.DrawString("Dirty Solar Panels Reduce Your Power Output!", $headlineFont, $navyBrush, $headlineRect)

$subRect = New-Object System.Drawing.RectangleF 64, 312, 850, 40
$graphics.DrawString("Real before and after rooftop cleaning proof with professional local team", $bodyFont, $mutedBrush, $subRect)

Draw-CoverImage -Graphics $graphics -ImagePath $beforeImage -X 64 -Y 352 -Width 452 -Height 274 -Radius 30
Draw-CoverImage -Graphics $graphics -ImagePath $afterImage -X 564 -Y 352 -Width 452 -Height 274 -Radius 30

$dividerPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#d7e6f5"), 3)
$graphics.DrawLine($dividerPen, 540, 366, 540, 610)
$dividerPen.Dispose()

[void](Draw-Badge -Graphics $graphics -Text "BEFORE: DUSTY + LOW OUTPUT" -Font $smallFont -TextBrush (New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#a04a39"))) -BackgroundBrush (New-Object System.Drawing.SolidBrush($softRed)) -X 82 -Y 368 -PaddingX 15 -PaddingY 7)
[void](Draw-Badge -Graphics $graphics -Text "AFTER: CLEAN + BETTER OUTPUT" -Font $smallFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 584 -Y 368 -PaddingX 15 -PaddingY 7)

$overlayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 14, 27, 42))
$beforeOverlay = New-RoundedRectPath -X 84 -Y 554 -Width 184 -Height 52 -Radius 18
$afterOverlay = New-RoundedRectPath -X 584 -Y 554 -Width 212 -Height 52 -Radius 18
$graphics.FillPath($overlayBrush, $beforeOverlay)
$graphics.FillPath($overlayBrush, $afterOverlay)
$graphics.DrawString("Dust blocks sunlight", $smallFont, $whiteBrush, 102, 568)
$graphics.DrawString("Professional purified water cleaning", $smallFont, $whiteBrush, 602, 568)
$beforeOverlay.Dispose()
$afterOverlay.Dispose()
$overlayBrush.Dispose()

$graphics.DrawString("↔", (New-Object System.Drawing.Font("Segoe UI Symbol", 28, [System.Drawing.FontStyle]::Bold)), $orangeBrush, 525, 460)

$benefitY = 660
$benefitData = @(
    @{ X = 64; Y = $benefitY; Icon = "⚡"; Title = "Increase Efficiency Up to 30%"; Bg = "#e9f4ff"; Accent = "#123051" },
    @{ X = 548; Y = $benefitY; Icon = "💧"; Title = "Safe & Chemical-Free Cleaning"; Bg = "#ecfbf2"; Accent = "#178a52" },
    @{ X = 64; Y = 736; Icon = "₹"; Title = "Affordable Service"; Bg = "#fff6ea"; Accent = "#d47a1b" },
    @{ X = 548; Y = 736; Icon = "🏢"; Title = "Residential & Commercial"; Bg = "#f3efff"; Accent = "#5f4bc7" }
)

foreach ($benefit in $benefitData) {
    $path = New-RoundedRectPath -X $benefit.X -Y $benefit.Y -Width 404 -Height 74 -Radius 24
    $fill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($benefit.Bg))
    $graphics.FillPath($fill, $path)
    $fill.Dispose()
    $iconBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($benefit.Accent))
    $graphics.DrawString($benefit.Icon, (New-Object System.Drawing.Font("Segoe UI Emoji", 22, [System.Drawing.FontStyle]::Regular)), $iconBrush, $benefit.X + 18, $benefit.Y + 18)
    $graphics.DrawString($benefit.Title, $subFont, $darkBrush, $benefit.X + 60, $benefit.Y + 22)
    $iconBrush.Dispose()
    $path.Dispose()
}

$trustPath = New-RoundedRectPath -X 64 -Y 842 -Width 430 -Height 88 -Radius 24
$trustBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f7fbff"))
$graphics.FillPath($trustBrush, $trustPath)
$trustBrush.Dispose()
$trustPath.Dispose()
$graphics.DrawString("★★★★★", $starFont, $orangeBrush, 88, 866)
$trustRect = New-Object System.Drawing.RectangleF 88, 892, 410, 40
$graphics.DrawString("Trusted by Homeowners & Businesses", $subFont, $navyBrush, $trustRect)

$waPanel = New-RoundedRectPath -X 516 -Y 842 -Width 500 -Height 88 -Radius 24
$waPanelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f3fbf7"))
$graphics.FillPath($waPanelBrush, $waPanel)
$waPanelBrush.Dispose()
$waPanel.Dispose()

$waCircle = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#25D366"))
$graphics.FillEllipse($waCircle, 540, 859, 54, 54)
$waCircle.Dispose()
$graphics.DrawString("☎", (New-Object System.Drawing.Font("Segoe UI Symbol", 24, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 553, 870)
$graphics.DrawString("WhatsApp booking available", $subFont, $greenBrush, 610, 862)
$graphics.DrawString("Google review style social proof", $bodyFont, $mutedBrush, 610, 896)

$ctaPath = New-RoundedRectPath -X 64 -Y 946 -Width 952 -Height 82 -Radius 28
$ctaFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 64, 946, 952, 82), [System.Drawing.ColorTranslator]::FromHtml("#178a52"), [System.Drawing.ColorTranslator]::FromHtml("#0f5f7f"), 0)
$graphics.FillPath($ctaFill, $ctaPath)
$ctaFill.Dispose()
$graphics.DrawString("Call Now: 8112780010", $ctaFont, $whiteBrush, 92, 972)
$graphics.DrawString("www.imsolarcare.in", $siteFont, $whiteBrush, 736, 980)
$ctaPath.Dispose()

$jpgEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92L)
$canvas.Save($outputPath, $jpgEncoder, $encoderParams)

$graphics.Dispose()
$canvas.Dispose()

$headlineFont.Dispose()
$subFont.Dispose()
$bodyFont.Dispose()
$smallFont.Dispose()
$ctaFont.Dispose()
$siteFont.Dispose()
$brandFont.Dispose()
$starFont.Dispose()
$navyBrush.Dispose()
$greenBrush.Dispose()
$mutedBrush.Dispose()
$whiteBrush.Dispose()
$darkBrush.Dispose()
$orangeBrush.Dispose()

Write-Output $outputPath
