# setup_env.ps1
# Setup script for Accesco Living Virtual Environment (Windows)

Write-Host "Setting up Accesco Living environment..." -ForegroundColor Cyan

# 1. Remove existing virtual environment if it exists
if (Test-Path -Path ".venv") {
    Write-Host "Removing existing .venv directory to prevent Anaconda symlink issues..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".venv"
}

# 2. Create a clean virtual environment
Write-Host "Creating fresh virtual environment..." -ForegroundColor Green
python -m venv .venv --clear

# 3. Activate and install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\pip.exe install -r requirements.txt

Write-Host "Setup complete! To activate the environment, run:" -ForegroundColor Cyan
Write-Host ".\.venv\Scripts\activate" -ForegroundColor Green
