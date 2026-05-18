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
    if ($Radius -le 0) {
        $path.AddRectangle((New-Object System.Drawing.RectangleF($X, $Y, $Width, $Height)))
        return $path
    }
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
        [float]$Radius = 28
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
        [float]$PaddingY = 9,
        [float]$Radius = 18
    )

    $size = $Graphics.MeasureString($Text, $Font)
    $width = $size.Width + ($PaddingX * 2)
    $height = $size.Height + ($PaddingY * 2)
    $path = New-RoundedRectPath -X $X -Y $Y -Width $width -Height $height -Radius $Radius
    $Graphics.FillPath($BackgroundBrush, $path)
    $Graphics.DrawString($Text, $Font, $TextBrush, $X + $PaddingX, $Y + $PaddingY - 1)
    $path.Dispose()
    return @{ Width = $width; Height = $height }
}

function New-BaseCanvas {
    param(
        [int]$Width,
        [int]$Height
    )

    $canvas = New-Object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.ColorTranslator]::FromHtml("#f4fbff"),
        [System.Drawing.ColorTranslator]::FromHtml("#e9f7ee"),
        45
    )
    $graphics.FillRectangle($bgBrush, $bgRect)
    $bgBrush.Dispose()

    $circleBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 34, 121, 196))
    $circleBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 22, 163, 74))
    $graphics.FillEllipse($circleBrush1, $Width - 300, -40, 320, 320)
    $graphics.FillEllipse($circleBrush2, -90, $Height - 280, 320, 320)
    $circleBrush1.Dispose()
    $circleBrush2.Dispose()

    return @{ Canvas = $canvas; Graphics = $graphics }
}

function Draw-Panel {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius = 42
    )

    $shadowPath = New-RoundedRectPath -X ($X + 8) -Y ($Y + 10) -Width $Width -Height $Height -Radius $Radius
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 18, 45, 71))
    $Graphics.FillPath($shadowBrush, $shadowPath)
    $shadowBrush.Dispose()
    $shadowPath.Dispose()

    $panelPath = New-RoundedRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 255, 255, 255))
    $Graphics.FillPath($panelBrush, $panelPath)
    $panelBrush.Dispose()
    $panelPath.Dispose()
}

function Save-Jpeg {
    param(
        [System.Drawing.Bitmap]$Canvas,
        [string]$OutputPath
    )

    $jpgEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, 92L)
    $Canvas.Save($OutputPath, $jpgEncoder, $encoderParams)
    $encoderParams.Dispose()
}

function Render-SquareBakrid {
    param(
        [string]$OutputPath,
        [string]$BeforeImage,
        [string]$AfterImage
    )

    $state = New-BaseCanvas -Width 1080 -Height 1080
    $canvas = $state.Canvas
    $graphics = $state.Graphics

    try {
        Draw-Panel -Graphics $graphics -X 34 -Y 28 -Width 1012 -Height 1020 -Radius 42

        $navy = [System.Drawing.ColorTranslator]::FromHtml("#123051")
        $green = [System.Drawing.ColorTranslator]::FromHtml("#178a52")
        $lightGreen = [System.Drawing.ColorTranslator]::FromHtml("#dcf6e9")
        $gold = [System.Drawing.ColorTranslator]::FromHtml("#d9a431")
        $muted = [System.Drawing.ColorTranslator]::FromHtml("#51606f")
        $orange = [System.Drawing.ColorTranslator]::FromHtml("#ff8d3a")

        $headlineFont = New-Object System.Drawing.Font("Segoe UI", 27, [System.Drawing.FontStyle]::Bold)
        $subFont = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
        $bodyFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
        $ctaFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
        $brandFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
        $smallFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)

        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $navyBrush = New-Object System.Drawing.SolidBrush($navy)
        $greenBrush = New-Object System.Drawing.SolidBrush($green)
        $mutedBrush = New-Object System.Drawing.SolidBrush($muted)
        $goldBrush = New-Object System.Drawing.SolidBrush($gold)

        [void](Draw-Badge -Graphics $graphics -Text "IMSOLARCARE" -Font $brandFont -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 64 -Y 54)
        [void](Draw-Badge -Graphics $graphics -Text "BAKRID OFFER" -Font $smallFont -TextBrush $whiteBrush -BackgroundBrush $goldBrush -X 64 -Y 114)
        [void](Draw-Badge -Graphics $graphics -Text "Professional Solar Panel Cleaning in Lucknow" -Font $smallFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 300 -Y 114)

        $graphics.DrawString("Bakrid Special Cleaning Offer", $headlineFont, $navyBrush, (New-Object System.Drawing.RectangleF 64, 172, 930, 56))
        $graphics.DrawString("Book rooftop solar cleaning from ₹499 with real local work proof and quick WhatsApp booking support.", $bodyFont, $mutedBrush, (New-Object System.Drawing.RectangleF 64, 238, 930, 60))

        Draw-CoverImage -Graphics $graphics -ImagePath $BeforeImage -X 64 -Y 336 -Width 452 -Height 286 -Radius 30
        Draw-CoverImage -Graphics $graphics -ImagePath $AfterImage -X 564 -Y 336 -Width 452 -Height 286 -Radius 30

        [void](Draw-Badge -Graphics $graphics -Text "BEFORE SERVICE" -Font $smallFont -TextBrush $navyBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#e9f4ff"))) -X 84 -Y 356 -PaddingX 15 -PaddingY 7)
        [void](Draw-Badge -Graphics $graphics -Text "AFTER SERVICE" -Font $smallFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 584 -Y 356 -PaddingX 15 -PaddingY 7)

        $benefitData = @(
            @{ X = 64; Y = 660; Title = "Bakrid festive booking slots"; Bg = "#fff6ea" },
            @{ X = 548; Y = 660; Title = "Real before / after proof"; Bg = "#e9f4ff" },
            @{ X = 64; Y = 738; Title = "Safe water panel cleaning"; Bg = "#ecfbf2" },
            @{ X = 548; Y = 738; Title = "Home and commercial rooftops"; Bg = "#f3efff" }
        )

        foreach ($benefit in $benefitData) {
            $path = New-RoundedRectPath -X $benefit.X -Y $benefit.Y -Width 404 -Height 74 -Radius 24
            $fill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($benefit.Bg))
            $graphics.FillPath($fill, $path)
            $graphics.DrawString($benefit.Title, $subFont, $navyBrush, $benefit.X + 22, $benefit.Y + 22)
            $fill.Dispose()
            $path.Dispose()
        }

        $trustPath = New-RoundedRectPath -X 64 -Y 842 -Width 952 -Height 88 -Radius 24
        $trustBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f7fbff"))
        $graphics.FillPath($trustBrush, $trustPath)
        $graphics.DrawString("Real rooftop photos • Lucknow local support • Check Bakrid festive availability today", $subFont, $navyBrush, (New-Object System.Drawing.RectangleF 88, 872, 880, 26))
        $trustBrush.Dispose()
        $trustPath.Dispose()

        $ctaPath = New-RoundedRectPath -X 64 -Y 954 -Width 952 -Height 74 -Radius 28
        $ctaFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 64, 954, 952, 74), [System.Drawing.ColorTranslator]::FromHtml("#178a52"), [System.Drawing.ColorTranslator]::FromHtml("#0f5f7f"), 0)
        $graphics.FillPath($ctaFill, $ctaPath)
        $graphics.DrawString("Call Now: 8112780010", $ctaFont, $whiteBrush, 92, 975)
        $graphics.DrawString("www.imsolarcare.in", (New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 730, 980)
        $ctaFill.Dispose()
        $ctaPath.Dispose()

        Save-Jpeg -Canvas $canvas -OutputPath $OutputPath

        $headlineFont.Dispose(); $subFont.Dispose(); $bodyFont.Dispose(); $ctaFont.Dispose(); $brandFont.Dispose(); $smallFont.Dispose()
        $whiteBrush.Dispose(); $navyBrush.Dispose(); $greenBrush.Dispose(); $mutedBrush.Dispose(); $goldBrush.Dispose()
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

function Render-SquareHindi {
    param(
        [string]$OutputPath,
        [string]$BeforeImage,
        [string]$AfterImage
    )

    $state = New-BaseCanvas -Width 1080 -Height 1080
    $canvas = $state.Canvas
    $graphics = $state.Graphics

    try {
        Draw-Panel -Graphics $graphics -X 34 -Y 28 -Width 1012 -Height 1020 -Radius 42

        $navy = [System.Drawing.ColorTranslator]::FromHtml("#123051")
        $green = [System.Drawing.ColorTranslator]::FromHtml("#178a52")
        $lightGreen = [System.Drawing.ColorTranslator]::FromHtml("#dcf6e9")
        $softBlue = [System.Drawing.ColorTranslator]::FromHtml("#e9f4ff")
        $muted = [System.Drawing.ColorTranslator]::FromHtml("#51606f")

        $headlineFont = New-Object System.Drawing.Font("Nirmala UI", 28, [System.Drawing.FontStyle]::Bold)
        $subFont = New-Object System.Drawing.Font("Nirmala UI", 16, [System.Drawing.FontStyle]::Bold)
        $bodyFont = New-Object System.Drawing.Font("Nirmala UI", 15, [System.Drawing.FontStyle]::Regular)
        $ctaFont = New-Object System.Drawing.Font("Nirmala UI", 21, [System.Drawing.FontStyle]::Bold)
        $brandFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $navyBrush = New-Object System.Drawing.SolidBrush($navy)
        $greenBrush = New-Object System.Drawing.SolidBrush($green)
        $mutedBrush = New-Object System.Drawing.SolidBrush($muted)

        [void](Draw-Badge -Graphics $graphics -Text "IMSOLARCARE" -Font $brandFont -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 64 -Y 54)
        [void](Draw-Badge -Graphics $graphics -Text "लखनऊ में प्रोफेशनल सोलर पैनल क्लीनिंग" -Font $subFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 64 -Y 116 -PaddingX 16 -PaddingY 8)

        $graphics.DrawString("बकरीद स्पेशल ऑफर", $headlineFont, $navyBrush, (New-Object System.Drawing.RectangleF 64, 176, 930, 54))
        $graphics.DrawString("सोलर पैनल क्लीनिंग ₹499 से शुरू। रियल पहले और बाद की फोटो, सेफ वॉटर क्लीनिंग और व्हाट्सऐप बुकिंग उपलब्ध।", $bodyFont, $mutedBrush, (New-Object System.Drawing.RectangleF 64, 240, 930, 60))

        Draw-CoverImage -Graphics $graphics -ImagePath $BeforeImage -X 64 -Y 336 -Width 452 -Height 286 -Radius 30
        Draw-CoverImage -Graphics $graphics -ImagePath $AfterImage -X 564 -Y 336 -Width 452 -Height 286 -Radius 30

        [void](Draw-Badge -Graphics $graphics -Text "पहले" -Font $subFont -TextBrush $navyBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($softBlue)) -X 84 -Y 356 -PaddingX 18 -PaddingY 7)
        [void](Draw-Badge -Graphics $graphics -Text "बाद में" -Font $subFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 584 -Y 356 -PaddingX 18 -PaddingY 7)

        $rows = @(
            @{ X = 64; Y = 660; Text = "रियल वर्क प्रूफ" ; Bg = "#e9f4ff" },
            @{ X = 548; Y = 660; Text = "सेफ वॉटर क्लीनिंग" ; Bg = "#ecfbf2" },
            @{ X = 64; Y = 738; Text = "घर और दुकान दोनों" ; Bg = "#fff6ea" },
            @{ X = 548; Y = 738; Text = "व्हाट्सऐप बुकिंग उपलब्ध" ; Bg = "#f3efff" }
        )
        foreach ($row in $rows) {
            $path = New-RoundedRectPath -X $row.X -Y $row.Y -Width 404 -Height 74 -Radius 24
            $fill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($row.Bg))
            $graphics.FillPath($fill, $path)
            $graphics.DrawString($row.Text, $subFont, $navyBrush, $row.X + 22, $row.Y + 20)
            $fill.Dispose()
            $path.Dispose()
        }

        $infoPath = New-RoundedRectPath -X 64 -Y 842 -Width 952 -Height 88 -Radius 24
        $infoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f7fbff"))
        $graphics.FillPath($infoBrush, $infoPath)
        $graphics.DrawString("लखनऊ, अलीगंज, जानकीपुरम, गोमती नगर और आसपास के एरिया में सर्विस उपलब्ध", $subFont, $navyBrush, (New-Object System.Drawing.RectangleF 88, 872, 880, 28))
        $infoBrush.Dispose()
        $infoPath.Dispose()

        $ctaPath = New-RoundedRectPath -X 64 -Y 954 -Width 952 -Height 74 -Radius 28
        $ctaFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 64, 954, 952, 74), [System.Drawing.ColorTranslator]::FromHtml("#178a52"), [System.Drawing.ColorTranslator]::FromHtml("#0f5f7f"), 0)
        $graphics.FillPath($ctaFill, $ctaPath)
        $graphics.DrawString("कॉल करें: 8112780010", $ctaFont, $whiteBrush, 92, 975)
        $graphics.DrawString("www.imsolarcare.in", (New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 730, 980)
        $ctaFill.Dispose()
        $ctaPath.Dispose()

        Save-Jpeg -Canvas $canvas -OutputPath $OutputPath

        $headlineFont.Dispose(); $subFont.Dispose(); $bodyFont.Dispose(); $ctaFont.Dispose(); $brandFont.Dispose()
        $whiteBrush.Dispose(); $navyBrush.Dispose(); $greenBrush.Dispose(); $mutedBrush.Dispose()
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

function Render-ReelCover {
    param(
        [string]$OutputPath,
        [string]$BeforeImage,
        [string]$AfterImage,
        [string]$SupportImage
    )

    $width = 1080
    $height = 1920
    $canvas = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    try {
        Draw-CoverImage -Graphics $graphics -ImagePath $AfterImage -X 0 -Y 0 -Width $width -Height $height -Radius 0
        $overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.Rectangle 0, 0, $width, $height),
            [System.Drawing.Color]::FromArgb(210, 8, 18, 28),
            [System.Drawing.Color]::FromArgb(165, 8, 18, 28),
            90
        )
        $graphics.FillRectangle($overlayBrush, 0, 0, $width, $height)
        $overlayBrush.Dispose()

        $green = [System.Drawing.ColorTranslator]::FromHtml("#25c06d")
        $orange = [System.Drawing.ColorTranslator]::FromHtml("#ff9b4a")
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $greenBrush = New-Object System.Drawing.SolidBrush($green)
        $headlineFont = New-Object System.Drawing.Font("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)
        $bigFont = New-Object System.Drawing.Font("Segoe UI", 54, [System.Drawing.FontStyle]::Bold)
        $subFont = New-Object System.Drawing.Font("Segoe UI", 23, [System.Drawing.FontStyle]::Bold)
        $bodyFont = New-Object System.Drawing.Font("Segoe UI", 19, [System.Drawing.FontStyle]::Regular)

        [void](Draw-Badge -Graphics $graphics -Text "IMSOLARCARE" -Font (New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)) -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 64 -Y 72 -PaddingX 20 -PaddingY 10)
        [void](Draw-Badge -Graphics $graphics -Text "INSTAGRAM REEL COVER" -Font $subFont -TextBrush $whiteBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 255, 155, 74))) -X 64 -Y 146 -PaddingX 18 -PaddingY 8)

        $graphics.DrawString("SOLAR PANEL", $headlineFont, $whiteBrush, 72, 292)
        $graphics.DrawString("CLEANING", $bigFont, $whiteBrush, 72, 350)
        $graphics.DrawString("LUCKNOW", $bigFont, $greenBrush, 72, 424)
        $graphics.DrawString("Real before / after proof • From ₹499 • WhatsApp booking", $bodyFont, $whiteBrush, (New-Object System.Drawing.RectangleF 66, 502, 920, 34))

        Draw-CoverImage -Graphics $graphics -ImagePath $BeforeImage -X 64 -Y 646 -Width 292 -Height 360 -Radius 32
        Draw-CoverImage -Graphics $graphics -ImagePath $AfterImage -X 394 -Y 646 -Width 292 -Height 360 -Radius 32
        Draw-CoverImage -Graphics $graphics -ImagePath $SupportImage -X 724 -Y 646 -Width 292 -Height 360 -Radius 32

        [void](Draw-Badge -Graphics $graphics -Text "BEFORE" -Font $subFont -TextBrush $whiteBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(155, 0, 0, 0))) -X 86 -Y 938 -PaddingX 18 -PaddingY 8)
        [void](Draw-Badge -Graphics $graphics -Text "AFTER" -Font $subFont -TextBrush $whiteBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(155, 0, 0, 0))) -X 418 -Y 938 -PaddingX 18 -PaddingY 8)
        [void](Draw-Badge -Graphics $graphics -Text "AMC" -Font $subFont -TextBrush $whiteBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(155, 0, 0, 0))) -X 748 -Y 938 -PaddingX 18 -PaddingY 8)

        $ctaPath = New-RoundedRectPath -X 64 -Y 1644 -Width 952 -Height 110 -Radius 34
        $ctaFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 64, 1644, 952, 110), $green, [System.Drawing.ColorTranslator]::FromHtml("#0f5f7f"), 0)
        $graphics.FillPath($ctaFill, $ctaPath)
        $graphics.DrawString("CALL / WHATSAPP 8112780010", (New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 122, 1680)
        $ctaFill.Dispose()
        $ctaPath.Dispose()

        Save-Jpeg -Canvas $canvas -OutputPath $OutputPath

        $whiteBrush.Dispose(); $greenBrush.Dispose()
        $headlineFont.Dispose(); $bigFont.Dispose(); $subFont.Dispose(); $bodyFont.Dispose()
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

function Render-MetaLessText {
    param(
        [string]$OutputPath,
        [string]$ImagePath
    )

    $state = New-BaseCanvas -Width 1080 -Height 1080
    $canvas = $state.Canvas
    $graphics = $state.Graphics

    try {
        Draw-Panel -Graphics $graphics -X 34 -Y 28 -Width 1012 -Height 1020 -Radius 42
        Draw-CoverImage -Graphics $graphics -ImagePath $ImagePath -X 64 -Y 84 -Width 952 -Height 640 -Radius 34

        $overlay = New-RoundedRectPath -X 64 -Y 84 -Width 952 -Height 640 -Radius 34
        $overlayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(82, 10, 18, 28))
        $graphics.FillPath($overlayBrush, $overlay)
        $overlayBrush.Dispose()
        $overlay.Dispose()

        $green = [System.Drawing.ColorTranslator]::FromHtml("#25c06d")
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $greenBrush = New-Object System.Drawing.SolidBrush($green)

        [void](Draw-Badge -Graphics $graphics -Text "IMSOLARCARE" -Font (New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)) -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 92 -Y 108)
        $graphics.DrawString("SOLAR PANEL", (New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 100, 506)
        $graphics.DrawString("CLEANING", (New-Object System.Drawing.Font("Segoe UI", 50, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 100, 548)
        $graphics.DrawString("LUCKNOW", (New-Object System.Drawing.Font("Segoe UI", 50, [System.Drawing.FontStyle]::Bold)), $greenBrush, 100, 606)

        $cardPath = New-RoundedRectPath -X 64 -Y 762 -Width 952 -Height 202 -Radius 32
        $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f7fbff"))
        $graphics.FillPath($cardBrush, $cardPath)
        $graphics.DrawString("FROM ₹499", (New-Object System.Drawing.Font("Segoe UI", 44, [System.Drawing.FontStyle]::Bold)), $greenBrush, 96, 808)
        $graphics.DrawString("Real local work proof", (New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#123051"))), 98, 872)

        $ctaPath = New-RoundedRectPath -X 716 -Y 804 -Width 260 -Height 88 -Radius 28
        $ctaBrush = New-Object System.Drawing.SolidBrush($green)
        $graphics.FillPath($ctaBrush, $ctaPath)
        $graphics.DrawString("BOOK NOW", (New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 770, 836)

        $cardBrush.Dispose()
        $cardPath.Dispose()
        $ctaBrush.Dispose()
        $ctaPath.Dispose()

        Save-Jpeg -Canvas $canvas -OutputPath $OutputPath
        $whiteBrush.Dispose(); $greenBrush.Dispose()
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

function Render-HindiPamphletA4 {
    param(
        [string]$OutputPath,
        [string]$BeforeImage,
        [string]$AfterImage,
        [string]$SupportImage
    )

    $width = 1240
    $height = 1754
    $canvas = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    try {
        $bgRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
        $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $bgRect,
            [System.Drawing.ColorTranslator]::FromHtml("#f5fbff"),
            [System.Drawing.ColorTranslator]::FromHtml("#edf8f1"),
            45
        )
        $graphics.FillRectangle($bgBrush, $bgRect)
        $bgBrush.Dispose()

        $circleBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(38, 37, 138, 196))
        $circleBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 23, 170, 85))
        $graphics.FillEllipse($circleBrush1, 930, -70, 360, 360)
        $graphics.FillEllipse($circleBrush2, -120, 1410, 360, 360)
        $circleBrush1.Dispose()
        $circleBrush2.Dispose()

        Draw-Panel -Graphics $graphics -X 42 -Y 34 -Width 1156 -Height 1686 -Radius 44

        $navy = [System.Drawing.ColorTranslator]::FromHtml("#123051")
        $green = [System.Drawing.ColorTranslator]::FromHtml("#178a52")
        $lightGreen = [System.Drawing.ColorTranslator]::FromHtml("#dcf6e9")
        $softBlue = [System.Drawing.ColorTranslator]::FromHtml("#e9f4ff")
        $softSand = [System.Drawing.ColorTranslator]::FromHtml("#fff4e7")
        $softLav = [System.Drawing.ColorTranslator]::FromHtml("#f1ecff")
        $muted = [System.Drawing.ColorTranslator]::FromHtml("#586675")
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $navyBrush = New-Object System.Drawing.SolidBrush($navy)
        $greenBrush = New-Object System.Drawing.SolidBrush($green)
        $mutedBrush = New-Object System.Drawing.SolidBrush($muted)

        $brandFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
        $kickerFont = New-Object System.Drawing.Font("Nirmala UI", 18, [System.Drawing.FontStyle]::Bold)
        $headlineFont = New-Object System.Drawing.Font("Nirmala UI", 36, [System.Drawing.FontStyle]::Bold)
        $subFont = New-Object System.Drawing.Font("Nirmala UI", 19, [System.Drawing.FontStyle]::Regular)
        $badgeFont = New-Object System.Drawing.Font("Nirmala UI", 18, [System.Drawing.FontStyle]::Bold)
        $smallFont = New-Object System.Drawing.Font("Nirmala UI", 17, [System.Drawing.FontStyle]::Bold)
        $ctaFont = New-Object System.Drawing.Font("Nirmala UI", 28, [System.Drawing.FontStyle]::Bold)

        [void](Draw-Badge -Graphics $graphics -Text "IMSOLARCARE" -Font $brandFont -TextBrush $whiteBrush -BackgroundBrush $greenBrush -X 82 -Y 76 -PaddingX 22 -PaddingY 10)
        [void](Draw-Badge -Graphics $graphics -Text "लखनऊ में प्रोफेशनल सोलर पैनल क्लीनिंग" -Font $kickerFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 82 -Y 146 -PaddingX 18 -PaddingY 8)

        $graphics.DrawString("सोलर पैनल क्लीनिंग", $headlineFont, $navyBrush, 84, 240)
        $graphics.DrawString("और मेंटेनेंस सेवा", $headlineFont, $greenBrush, 84, 296)
        $graphics.DrawString("घर, दुकान, ऑफिस और कमर्शियल रूफटॉप के लिए लोकल सपोर्ट।", $subFont, $mutedBrush, (New-Object System.Drawing.RectangleF 86, 374, 760, 44))
        $graphics.DrawString("रियल वर्क फोटो • सेफ क्लीनिंग • आसान बुकिंग", $subFont, $mutedBrush, (New-Object System.Drawing.RectangleF 86, 416, 890, 40))

        $heroPath = New-RoundedRectPath -X 830 -Y 224 -Width 290 -Height 224 -Radius 34
        $heroBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f6fbff"))
        $graphics.FillPath($heroBrush, $heroPath)
        $graphics.DrawString("क्यों ज़रूरी है?", $badgeFont, $navyBrush, 860, 256)
        $graphics.DrawString("धूल और गंदगी", $subFont, $mutedBrush, 860, 304)
        $graphics.DrawString("जमने पर पैनल", $subFont, $mutedBrush, 860, 344)
        $graphics.DrawString("जल्दी फीके दिखते हैं।", $subFont, $mutedBrush, 860, 384)
        $heroBrush.Dispose()
        $heroPath.Dispose()

        Draw-CoverImage -Graphics $graphics -ImagePath $BeforeImage -X 82 -Y 498 -Width 340 -Height 338 -Radius 32
        Draw-CoverImage -Graphics $graphics -ImagePath $AfterImage -X 450 -Y 498 -Width 340 -Height 338 -Radius 32
        Draw-CoverImage -Graphics $graphics -ImagePath $SupportImage -X 818 -Y 498 -Width 300 -Height 338 -Radius 32

        [void](Draw-Badge -Graphics $graphics -Text "पहले" -Font $badgeFont -TextBrush $navyBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($softBlue)) -X 106 -Y 524 -PaddingX 18 -PaddingY 8)
        [void](Draw-Badge -Graphics $graphics -Text "बाद में" -Font $badgeFont -TextBrush $greenBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($lightGreen)) -X 478 -Y 524 -PaddingX 18 -PaddingY 8)
        [void](Draw-Badge -Graphics $graphics -Text "AMC / निरीक्षण" -Font $badgeFont -TextBrush $navyBrush -BackgroundBrush (New-Object System.Drawing.SolidBrush($softLav)) -X 840 -Y 524 -PaddingX 18 -PaddingY 8)

        $rowData = @(
            @{ X = 82; Y = 884; Text = "रियल वर्क प्रूफ"; Bg = "#e9f4ff" },
            @{ X = 450; Y = 884; Text = "सेफ वॉटर क्लीनिंग"; Bg = "#ecfbf2" },
            @{ X = 818; Y = 884; Text = "लोकल बुकिंग सपोर्ट"; Bg = "#fff4e7" },
            @{ X = 82; Y = 970; Text = "घर और दुकान दोनों"; Bg = "#fff4e7" },
            @{ X = 450; Y = 970; Text = "मेंटेनेंस और AMC"; Bg = "#f1ecff" },
            @{ X = 818; Y = 970; Text = "व्हाट्सऐप उपलब्ध"; Bg = "#ecfbf2" }
        )
        foreach ($row in $rowData) {
            $path = New-RoundedRectPath -X $row.X -Y $row.Y -Width 300 -Height 66 -Radius 22
            $fill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($row.Bg))
            $graphics.FillPath($fill, $path)
            $graphics.DrawString($row.Text, $smallFont, $navyBrush, $row.X + 20, $row.Y + 17)
            $fill.Dispose()
            $path.Dispose()
        }

        $areaPath = New-RoundedRectPath -X 82 -Y 1076 -Width 1036 -Height 174 -Radius 34
        $areaBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f7fbff"))
        $graphics.FillPath($areaBrush, $areaPath)
        $graphics.DrawString("सेवा क्षेत्र", $badgeFont, $greenBrush, 108, 1108)
        $graphics.DrawString("लखनऊ, अलीगंज, जानकीपुरम, गोमती नगर, विकास नगर", $smallFont, $navyBrush, (New-Object System.Drawing.RectangleF 108, 1150, 950, 32))
        $graphics.DrawString("इंदिरा नगर और आसपास। कॉल या व्हाट्सऐप पर अपना एरिया बताइए।", $subFont, $mutedBrush, (New-Object System.Drawing.RectangleF 108, 1194, 920, 28))
        $areaBrush.Dispose()
        $areaPath.Dispose()

        $ctaPath = New-RoundedRectPath -X 82 -Y 1284 -Width 1036 -Height 132 -Radius 34
        $ctaFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 82, 1284, 1036, 132), [System.Drawing.ColorTranslator]::FromHtml("#178a52"), [System.Drawing.ColorTranslator]::FromHtml("#0f5f7f"), 0)
        $graphics.FillPath($ctaFill, $ctaPath)
        $graphics.DrawString("कॉल / व्हाट्सऐप: 8112780010", $ctaFont, $whiteBrush, 126, 1326)
        $graphics.DrawString("www.imsolarcare.in", (New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)), $whiteBrush, 794, 1332)
        $ctaFill.Dispose()
        $ctaPath.Dispose()

        Save-Jpeg -Canvas $canvas -OutputPath $OutputPath

        $whiteBrush.Dispose()
        $navyBrush.Dispose()
        $greenBrush.Dispose()
        $mutedBrush.Dispose()
        $brandFont.Dispose()
        $kickerFont.Dispose()
        $headlineFont.Dispose()
        $subFont.Dispose()
        $badgeFont.Dispose()
        $smallFont.Dispose()
        $ctaFont.Dispose()
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root "assets"
$beforeImage = Join-Path $assets "solar-cleaning-before-2.jpg"
$afterImage = Join-Path $assets "solar-cleaning-after-1.jpg"
$supportImage = Join-Path $assets "solar-amc-inverter-check.jpg"

Render-SquareBakrid -OutputPath (Join-Path $assets "imsolarcare-bakrid-offer-square.jpg") -BeforeImage $beforeImage -AfterImage $afterImage
Render-SquareHindi -OutputPath (Join-Path $assets "imsolarcare-hindi-offer-square.jpg") -BeforeImage $beforeImage -AfterImage $afterImage
Render-ReelCover -OutputPath (Join-Path $assets "imsolarcare-instagram-reel-cover.jpg") -BeforeImage $beforeImage -AfterImage $afterImage -SupportImage $supportImage
Render-MetaLessText -OutputPath (Join-Path $assets "imsolarcare-meta-less-text-square.jpg") -ImagePath $afterImage
Render-HindiPamphletA4 -OutputPath (Join-Path $assets "imsolarcare-hindi-pamphlet-a4.jpg") -BeforeImage $beforeImage -AfterImage $afterImage -SupportImage $supportImage
