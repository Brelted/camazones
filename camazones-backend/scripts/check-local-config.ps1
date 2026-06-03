$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envPath = Join-Path $root ".env.local"
$values = @{}
if (Test-Path $envPath) {
  Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $values[$matches[1].Trim()] = $matches[2].Trim()
    }
  }
}
$client = New-Object System.Net.Sockets.TcpClient
$iar = $client.BeginConnect('127.0.0.1', 3306, $null, $null)
$mysqlOpen = $iar.AsyncWaitHandle.WaitOne(1200, $false)
if ($mysqlOpen) { try { $client.EndConnect($iar) } catch { $mysqlOpen = $false } }
$client.Close()
$mailPassword = $values['CAMAZONES_MAIL_PASSWORD']
$stripeSecret = $values['STRIPE_SECRET_KEY']
$stripeCompact = ($stripeSecret -replace '\s', '')
$googleKey = $values['GOOGLE_API_KEY']
$geminiKey = $values['GEMINI_API_KEY']
$result = [ordered]@{
  EnvLocal = (Test-Path $envPath)
  WampMysql3306 = [bool]$mysqlOpen
  MailUser = [bool]$values['CAMAZONES_MAIL_USERNAME']
  MailPasswordConfigured = [bool]$mailPassword
  StripeSecretConfigured = ($stripeCompact -like 'sk_test_*' -or $stripeCompact -like 'sk_live_*') -and ($stripeCompact -notlike '*remplacer*')
  OpenAiKeyConfigured = ($values['OPENAI_API_KEY'] -like 'sk-*')
  GoogleSpeechKeyConfigured = ($googleKey -like 'AIza*' -or $geminiKey -like 'AIza*')
}
$result.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, $_.Value }
