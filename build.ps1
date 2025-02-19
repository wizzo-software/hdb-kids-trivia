$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^(.*?)=(.*)$") {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value)
        }
    }
    $projectDirectory = [Environment]::GetEnvironmentVariable("PROJECT_DIRECTORY")
} else {
    Write-Error "File .env not found."
    exit 1
}

$originalLocation = Get-Location

Remove-Item -Path "$projectDirectory\www" -Recurse -Force
New-Item -Path "$projectDirectory\www" -ItemType Directory
Copy-Item -Path ".\dist\*" -Destination "$projectDirectory\www" -Recurse -Force
Set-Location -Path $projectDirectory
cordova build android
Start-Process -FilePath "$projectDirectory\platforms\android\app\build\outputs\apk\debug"
Set-Location -Path $originalLocation