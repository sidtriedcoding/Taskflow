@echo off
echo Setting up Git repository for TaskFlow project...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo Then restart your terminal and run this script again
    pause
    exit /b 1
)

echo Git is installed! Version:
git --version
echo.

REM Navigate to project directory
cd /d "D:\sidu\Taskflow-main (1)\Taskflow-main"

REM Initialize Git repository if not already initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Set up Git user (you'll need to update these with your details)
echo Setting up Git user configuration...
set /p username="Enter your GitHub username: "
set /p email="Enter your GitHub email: "

git config user.name "%username%"
git config user.email "%email%"
echo.

REM Add all files to staging
echo Adding all files to Git...
git add .
echo.

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: TaskFlow project with priority filtering fixes"
echo.

REM Instructions for connecting to GitHub
echo.
echo =====================================
echo Next steps to connect to GitHub:
echo =====================================
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL
echo 3. Run: git remote add origin [YOUR_REPO_URL]
echo 4. Run: git branch -M main
echo 5. Run: git push -u origin main
echo.
echo Or you can use GitHub Desktop for easier management
echo.
pause
