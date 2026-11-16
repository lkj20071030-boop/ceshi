$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
Write-Host 'DeepSeek API Key setup. The key is stored only in server/.env.'
$secureKey = Read-Host 'Paste API Key (input is hidden)' -AsSecureString
$plainKey = [System.Net.NetworkCredential]::new('', $secureKey).Password
if ($plainKey -notmatch '^[A-Za-z0-9_-]{12,}$') { throw 'Invalid key format. No configuration was written.' }
$configPath = Join-Path $projectRoot 'server/.env'
$templatePath = Join-Path $projectRoot 'server/.env.example'
$content = if (Test-Path -LiteralPath $configPath) { [System.IO.File]::ReadAllText($configPath) } else { [System.IO.File]::ReadAllText($templatePath) }
$line = 'DEEPSEEK_API_KEY=' + $plainKey
if ($content -match '(?m)^DEEPSEEK_API_KEY=') { $content = [regex]::Replace($content, '(?m)^DEEPSEEK_API_KEY=[^\r\n]*', $line) } else { $content += "`r`n$line`r`n" }
[System.IO.File]::WriteAllText($configPath, $content, [System.Text.UTF8Encoding]::new($false))
$plainKey = $null
$content = $null
Write-Host 'Saved. Restart the backend, then submit a new concept question to verify the model.'
Read-Host 'Press Enter to close'
