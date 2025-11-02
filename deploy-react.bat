@echo off
echo ================================
echo   stevenBAM React Deployment
echo ================================
echo.

REM Navigate to React app directory
cd react-app

echo [1/3] Building React app for production...
call npm run build
if errorlevel 1 (
    echo ERROR: React build failed!
    pause
    exit /b 1
)

echo [2/3] Creating deployment package...
cd build
tar -czf react-app-deploy.tar.gz *
if errorlevel 1 (
    echo ERROR: Failed to create deployment package!
    pause
    exit /b 1
)

echo [3/3] Moving package to project root...
move react-app-deploy.tar.gz ..\..\
cd ..\..

echo.
echo ✅ React deployment package created successfully!
echo 📦 File: react-app-deploy.tar.gz
echo 🚀 Upload this file to your Hostinger public_html/ directory
echo.
echo Next steps:
echo 1. Go to Hostinger File Manager
echo 2. Navigate to public_html/
echo 3. Upload react-app-deploy.tar.gz
echo 4. Extract the contents
echo.
pause