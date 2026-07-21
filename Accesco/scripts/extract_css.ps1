$pagePath = 'c:\Users\jxtro\Desktop\accesco website\Accesco-Website\Accesco\app\page.js'
$cssPath = 'c:\Users\jxtro\Desktop\accesco website\Accesco-Website\Accesco\app\homepage.css'
$lines = Get-Content $pagePath
$cssContent = $lines[269..597]
$cssContent | Add-Content $cssPath -Encoding UTF8

$newLines = $lines[0..267] + $lines[599..($lines.Count-1)]
$newLines | Set-Content $pagePath -Encoding UTF8
Write-Host "Done"
