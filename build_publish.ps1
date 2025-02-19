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


function Update-Version($path) {
    $configFilePath = "$path\config.xml"
    $configContent = Get-Content $configFilePath -Raw -Encoding UTF8
    $widgetVersionRegex = '(<widget[^>]*)version="(\d+)\.(\d+)\.(\d+)"'

    if ($configContent -match $widgetVersionRegex) {
        $major = [int]$matches[2]
        $minor = [int]$matches[3]
        $patch = [int]$matches[4]

        # Increment the patch version
        $patch += 1

        # Handle rollover of patch to minor, and minor to major if needed
        if ($patch -ge 10) {
            $patch = 0
            $minor += 1
        }
        if ($minor -ge 10) {
            $minor = 0
            $major += 1
        }

        # Construct the new version string
        $newVersion = "$major.$minor.$patch"

        # Replace the version without affecting other attributes in the <widget> tag
        $newConfigContent = $configContent -replace $widgetVersionRegex, "`${1}version=`"$newVersion`""

        # Write the updated content back to config.xml with UTF-8 encoding
        Set-Content -Path $configFilePath -Value $newConfigContent -Encoding UTF8

        Write-Output "Version updated to $newVersion in $path"
    } else {
        Write-Output "Version attribute not found within <widget> tag in $path/config.xml"
    }
}
    
Update-Version $projectDirectory

Remove-Item -Path "$projectDirectory\www" -Recurse -Force
New-Item -Path "$projectDirectory\www" -ItemType Directory
Copy-Item -Path ".\dist\*" -Destination "$projectDirectory\www" -Recurse -Force
Set-Location -Path $projectDirectory
cordova build android --release -- --packageType=bundle --buildConfig=build.json
Start-Process -FilePath "$projectDirectory\platforms\android\app\build\outputs\bundle\release"
Set-Location -Path $originalLocation