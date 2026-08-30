#!/bin/bash
# setup_env.sh
# Setup script for Accesco Living Virtual Environment (Mac/Linux)

set -e

echo -e "\033[1;36mSetting up Accesco Living environment...\033[0m"

# 1. Remove existing virtual environment if it exists
if [ -d ".venv" ]; then
    echo -e "\033[1;33mRemoving existing .venv directory to ensure a clean build...\033[0m"
    rm -rf .venv
fi

# 2. Create a clean virtual environment
echo -e "\033[1;32mCreating fresh virtual environment...\033[0m"
python3 -m venv .venv --clear

# 3. Activate and install dependencies
echo -e "\033[1;32mInstalling dependencies...\033[0m"
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo -e "\033[1;36mSetup complete! To activate the environment, run:\033[0m"
echo -e "\033[1;32msource .venv/bin/activate\033[0m"
