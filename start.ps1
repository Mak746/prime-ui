Write-Host "`n***************************************"
Write-Host "Welcome to WeCare.et Deployment!"
Write-Host "***************************************`n"

$choices = @(
    "Production-Build",
    "Production-Start",
    "Test-Up",
    "Test-Down",
    "Development",
    "Stop Development",
    "Remove Development",
    "Exit"
)

# Display choices
for ($i = 0; $i -lt $choices.Count; $i++) {
    Write-Host "$($i+1)) $($choices[$i])"
}

# Get user input
$choice = Read-Host "`nPlease enter the number of your choice"

switch ($choices[$choice - 1]) {
    "Production-Build" {
        Write-Host "`nStarting Production Build...`n"
        docker compose -p wecare --env-file .\.env -f .\docker-compose.yml build
    }
    "Production-Start" {
        Write-Host "`nStarting Production Deployment...`n"
        docker compose --env-file .\.env -p wecare -f .\docker-compose.yml up --build --scale api=32 -d
        docker stop adminer
    }
    "Test-Up" {
        Write-Host "`nStarting Deployment Test at https://wecare.et...`n"
        docker compose --env-file .\backend\env\test.env -p wecare -f .\docker-compose.test.yml up --build --scale wecare-api=4 -d
    }
    "Test-Down" {
        Write-Host "`nTearing down Test Deployment...`n"
        docker compose --env-file .\backend\env\test.env -p wecare -f .\docker-compose.test.yml down
    }
    "Development" {
        Write-Host "`nStarting localhost Development Deployment...`n"
        docker compose --env-file .\backend\env\development.env -f .\docker-compose.dev.yml up --build -d
    }
    "Stop Development" {
        Write-Host "`nStopping localhost Development Deployment...`n"
        docker compose --env-file .\backend\env\development.env -f .\docker-compose.dev.yml stop
    }
    "Remove Development" {
        Write-Host "`nRemoving localhost Development Deployment...`n"
        docker compose --env-file .\backend\env\development.env -f .\docker-compose.dev.yml down
    }
    "Exit" {
        Write-Host "Exiting..."
    }
    Default {
        Write-Host "Invalid selection. Please try again."
    }
}
