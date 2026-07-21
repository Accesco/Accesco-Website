$filePath = 'c:\Users\jxtro\Desktop\accesco website\Accesco-Website\Accesco\app\page.js'
$lines = Get-Content $filePath
$header = $lines[0..13]
$body = $lines[1470..($lines.Count-1)]
$result = $header + '' + $body
$result | Set-Content $filePath -Encoding UTF8
Write-Host "Done. New line count: $($result.Count)"
