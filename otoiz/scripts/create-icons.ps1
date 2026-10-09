Add-Type -AssemblyName System.Drawing
$iconDirectory = Join-Path $PSScriptRoot '../public/icons'
New-Item -ItemType Directory -Force -Path $iconDirectory | Out-Null
foreach ($iconSize in @(192,512,180)) {
 $bitmap=[Drawing.Bitmap]::new($iconSize,$iconSize)
 $graphics=[Drawing.Graphics]::FromImage($bitmap)
 $graphics.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
 $graphics.Clear([Drawing.ColorTranslator]::FromHtml('#101820'))
 $blue=[Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml('#408bff'),$iconSize*0.05)
 $road=[Drawing.Pen]::new([Drawing.ColorTranslator]::FromHtml('#408bff'),$iconSize*0.022)
 $graphics.DrawEllipse($blue,$iconSize*0.2,$iconSize*0.2,$iconSize*0.6,$iconSize*0.6)
 $graphics.DrawLine($road,$iconSize*0.37,$iconSize*0.72,$iconSize*0.44,$iconSize*0.28)
 $graphics.DrawLine($road,$iconSize*0.63,$iconSize*0.72,$iconSize*0.56,$iconSize*0.28)
 foreach($y in @(0.32,0.47,0.62)){$graphics.DrawLine($road,$iconSize*0.5,$iconSize*$y,$iconSize*0.5,$iconSize*($y+0.06))}
 $filename=if($iconSize -eq 180){'apple-touch-icon.png'}else{"icon-$iconSize.png"}
 $bitmap.Save((Join-Path $iconDirectory $filename),[Drawing.Imaging.ImageFormat]::Png)
 $blue.Dispose();$road.Dispose();$graphics.Dispose();$bitmap.Dispose()
}